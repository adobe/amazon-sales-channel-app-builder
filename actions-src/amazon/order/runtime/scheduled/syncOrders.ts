/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import SellingPartnerAPI from 'amazon-sp-api';
import Logger from '../../../../shared/logger';
import { errorResponse } from '../../../../shared/utils';
import { getOrderItems, getOrders } from '../../../amazonSpApi';
import { getCommerceOauthClient } from '../../../../commerce/oauth1a';
import { AccountRepository } from '../../../../api/account/repository/accountRepository';
import { getAmazonClient } from '../../../../shared/getAmazonClient';
import { getCountryById } from '../../../../shared/localization/country';
import Account = AmazonSalesChannel.Model.Account;
import EncryptionRequest = AdobeRuntime.EncryptionRequest;
import CommerceId = AmazonSalesChannel.Model.CommerceId;
import AmazonOrder = AmazonSalesChannel.Model.AmazonOrder;
import AmazonOrderItem = AmazonSalesChannel.Model.AmazonOrderItem;

interface OauthClient {
  post: any;
  get: any;
}

type Params = Readonly<AdobeRuntime.RequestParams> &
  Readonly<EncryptionRequest> &
  Readonly<CommerceId>;

export function isImportAmazonOrdersEnabled(accountData?: Account): boolean {
  if (!accountData) {
    return false;
  }
  const { orderSettings } = accountData;
  return orderSettings !== undefined && orderSettings?.enableImportAmazonOrders === 1;
}

async function createOrder(
  commerceClient: OauthClient,
  guestCartId: string,
  amazonOrder: AmazonOrder,
) {
  return (await commerceClient.post(`guest-carts/${guestCartId}/payment-information`, {
    paymentMethod: {
      method: 'checkmo',
    },
    billing_address: mapAddress(amazonOrder),
  })) as Promise<any>;
}

async function prepareForCheckout(
  commerceClient: OauthClient,
  guestCartId: string,
  amazonOrder: AmazonOrder,
) {
  await commerceClient.post(`guest-carts/${guestCartId}/shipping-information`, {
    addressInformation: {
      shipping_address: mapAddress(amazonOrder),
      billing_address: mapAddress(amazonOrder),
      shipping_carrier_code: 'flatrate',
      shipping_method_code: 'flatrate',
    },
  });
}

async function addItemToCart(
  commerceClient: OauthClient,
  guestCartId: string,
  amazonOrderItem: AmazonOrderItem,
) {
  await commerceClient.post(`guest-carts/${guestCartId}/items`, {
    cartItem: {
      quote_id: guestCartId,
      sku: amazonOrderItem.SellerSKU,
      qty: amazonOrderItem.QuantityOrdered,
    },
  });
}

export function mapAddress(amazonOrder: AmazonOrder) {
  return {
    region: amazonOrder.ShippingAddress.StateOrRegion,
    region_id: amazonOrder.ShippingAddress.StateOrProvinceCode,
    region_code: amazonOrder.ShippingAddress.StateOrProvinceCode,
    country_id: amazonOrder.ShippingAddress.CountryCode,
    street: [amazonOrder.ShippingAddress.AddressLine1],
    postcode: amazonOrder.ShippingAddress.PostalCode,
    city: amazonOrder.ShippingAddress.City,
    firstname: amazonOrder.BuyerInfo.BuyerName,
    lastname: amazonOrder.BuyerInfo.BuyerName,
    email: amazonOrder.BuyerInfo.BuyerEmail,
    telephone: amazonOrder.ShippingAddress.Phone,
  };
}

export async function main(params: Params) {
  const logger: Logger = new Logger(params.LOG_LEVEL);
  logger.info('Sync orders from Amazon into Adobe Commerce');

  async function processOrders(
    amazonLatestOrders: Array<AmazonOrder>,
    accountId: string,
    commerceClient: OauthClient,
    amazonClient: SellingPartnerAPI,
  ): Promise<Array<string>> {
    const orderIds: Array<string> = [];

    let key: string;
    let amazonOrder: AmazonOrder;
    for ([key, amazonOrder] of Object.entries(amazonLatestOrders)) {
      const amazonOrderId = amazonOrder.AmazonOrderId;
      try {
        // Step 2: Find the customer in Adobe Commerce and generate a customer token
        // TODO check how to get a customer token using customer's email

        // Step 3: Create a quote and retrieve the quoteId also known as cartId
        // TODO replace the guest call with actual call using the customer token
        // https://developer.adobe.com/commerce/webapi/rest/tutorials/orders/order-create-quote/

        logger.info('Create guest quote in Adobe Commerce', { amazonOrderId, accountId });

        const guestCartResponse = await commerceClient.post('guest-carts', {});
        const guestCartId: string = (await guestCartResponse.text()).replace(/(^"|"$)/g, '');

        // Step 4: Retrieve order items from Amazon

        logger.info('Retrieve order items from Amazon based on Amazon order Id', {
          amazonOrderId,
          accountId,
        });

        const amazonOrderItems = await getOrderItems(amazonClient, amazonOrderId);

        for (const amazonOrderItem of amazonOrderItems) {
          // Step 5: Add items to the cart using the quoteId
          // TODO replace the guest call with the actual call using the customer token

          logger.info('Add item to cart', { amazonOrderId, accountId });
          await addItemToCart(commerceClient, guestCartId, amazonOrderItem);
        }

        // Step 6: Prepare for checkout
        // TODO replace the guest call with the actual call using the customer token

        logger.info('Prepare for checkout in Adobe Commerce', { amazonOrderId, accountId });
        await prepareForCheckout(commerceClient, guestCartId, amazonOrder);

        // Step 7: Create order
        // TODO replace the guest call with the actual call using the customer token

        logger.info('Create order in Adobe Commerce', { amazonOrderId, accountId });

        const createOrderResponse = await createOrder(commerceClient, guestCartId, amazonOrder);

        const commerceOrderId: string = await createOrderResponse.json();
        orderIds.push(commerceOrderId);
        logger.info('A new order was created in Commerce', {
          amazonOrderId,
          commerceOrderId,
          accountId,
        });
      } catch (error: unknown) {
        logger.error(
          'Cannot import order',
          {
            amazonOrderId,
            errorMessage: error instanceof Error ? error.message : '',
            accountId,
          },
          error,
        );
      }
    }
    return orderIds;
  }

  try {
    const commerceClient: OauthClient = getCommerceOauthClient(
      {
        url: params.COMMERCE_BASE_URL,
        consumerKey: params.COMMERCE_CONSUMER_KEY,
        consumerSecret: params.COMMERCE_CONSUMER_SECRET,
        accessToken: params.COMMERCE_ACCESS_TOKEN,
        accessTokenSecret: params.COMMERCE_ACCESS_TOKEN_SECRET,
      },
      logger,
    );

    const accountRepository = new AccountRepository(logger);
    const accounts = await accountRepository.getAccounts();

    const syncedAccountsOrders = [];
    const syncAccountsOrdersErrors = [];

    const marketplaces: string[] = [];
    const createdAfter = new Date();

    for (const index in accounts) {
      if (Object.hasOwn(accounts, index)) {
        const account: Account = accounts[index];
        const accountId: string = account.id;

        const country = getCountryById(account.countryId);

        if (country === undefined) {
          continue;
        }

        const marketplaceId: string = country.marketplaceId;

        if (isImportAmazonOrdersEnabled(account) && !marketplaces.includes(marketplaceId)) {
          try {
            // Step 1: Request the latest orders from Amazon SP-API
            // TODO check the correct date to consider when retrieving the latest orders

            logger.info('Get orders from Amazon', { accountId });

            const amazonClient = await getAmazonClient(
              account.id,
              params.ENCRYPTION_KEY,
              params.ENCRYPTION_IV,
              logger,
            );
            const amazonLatestOrders = await getOrders(
              amazonClient,
              logger,
              marketplaceId,
              createdAfter,
            );

            logger.info('Orders returned by Amazon', {
              count: amazonLatestOrders.length,
              accountId,
            });

            const orderIds = await processOrders(
              amazonLatestOrders,
              accountId,
              commerceClient,
              amazonClient,
            );

            syncedAccountsOrders.push({
              accountId,
              orders: orderIds,
            });

            marketplaces.push(marketplaceId);
          } catch (error: unknown) {
            logger.error('cannot import orders for account', { accountId }, error);
            syncAccountsOrdersErrors.push({
              accountId,
              errorMessage: error instanceof Error ? error.message : '',
            });
          }
        }
      }
    }

    logger.info('Synced account orders', {
      successSyncs: syncedAccountsOrders,
      failedSyncs: syncAccountsOrdersErrors,
    });

    return {
      statusCode: 200,
      body: {
        successSyncs: syncedAccountsOrders,
        failedSyncs: syncAccountsOrdersErrors,
      },
    };
  } catch (error: unknown) {
    logger.error('Cannot sync orders', {}, error);
    return errorResponse(500, 'Cannot sync orders', logger);
  }
}
