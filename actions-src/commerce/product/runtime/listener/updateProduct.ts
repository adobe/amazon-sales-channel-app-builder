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
import { randomUUID } from 'node:crypto';
import { errorResponse } from '../../../../shared/utils';
import {
  getCatalogItem,
  publishProduct,
  UpdateProductConditionError,
  updateProductConditionPriceAndQty,
} from '../../../../amazon/amazonSpApi';
import Logger from '../../../../shared/logger';
import { ProductRepository } from '../../../../api/product/repository/productRepository';
import { getAmazonClient } from '../../../../shared/getAmazonClient';
import { getCountryById } from '../../../../shared/localization/country';
import { AccountRepository } from '../../../../api/account/repository/accountRepository';
import { CommunicationErrorLogRepository } from '../../../../api/audit/repository/communicationErrorLogRepository';
import { ListingChangesRepository } from '../../../../api/audit/repository/listingChangesRepository';
import CatalogProductSaveAfterEvent = AmazonSalesChannel.Model.CatalogProductSaveAfterEvent;
import CommerceId = AmazonSalesChannel.Model.CommerceId;
import Product = AmazonSalesChannel.Model.Product;
import Status = AmazonSalesChannel.Model.Status;
import ProductCondition = AmazonSalesChannel.Model.ProductCondition;
import EncryptionRequest = AdobeRuntime.EncryptionRequest;
import CountryName = AmazonSalesChannel.Model.CountryName;
import CommunicationErrorLog = AmazonSalesChannel.Model.CommunicationErrorLog;
import Account = AmazonSalesChannel.Model.Account;
import ListingChange = AmazonSalesChannel.Model.ListingChange;

type Params = AdobeRuntime.RequestParams &
  EncryptionRequest &
  CatalogProductSaveAfterEvent &
  CommerceId;

const errorResponseHandler = errorResponse as AdobeRuntime.ErrorResponseHandler;
const ALL_MAGENTO_WEBSITES = 0;

export async function main(params: Readonly<Params>) {
  const logger = new Logger(params.LOG_LEVEL);
  const websiteId = Number(params.data._metadata.websiteId);
  const sku = params.data.value.sku;

  const accountRepository = new AccountRepository(logger);
  const accounts = await accountRepository.getAccounts();

  const result: any = [];
  let hasErrors = false;
  for (const [id, account] of Object.entries(accounts)) {
    const country = getCountryById(account.countryId);

    if (
      (websiteId === ALL_MAGENTO_WEBSITES || websiteId === account.websiteId) &&
      country !== undefined
    ) {
      const sellerId = account.sellerId;

      const isAutomaticListEnabled = account.listingSettings?.automaticListActionId === 1;
      const productCondition = getProductCondition(
        account.listingSettings?.listProductConditionId,
        params,
      );
      try {
        const product = await processUpdateEvent(
          country.marketplaceId,
          sellerId,
          country.id,
          sku,
          params,
          logger,
          isAutomaticListEnabled,
          productCondition,
          account,
        );
        if (product) {
          result.push(product);
        }
      } catch (error: unknown) {
        logger.error('Failed to process product update', { id }, error);
        hasErrors = true;
      }
    }
  }

  if (hasErrors) {
    return errorResponseHandler(500, 'Server error', logger);
  }

  return {
    statusCode: 200,
    body: result,
  };
}

async function processUpdateEvent(
  marketplaceId: string,
  sellerId: string,
  countryId: number,
  sku: string,
  params: Readonly<Params>,
  logger: Logger,
  isAutomaticListEnabled: boolean,
  productCondition: string,
  account: Account,
) {
  const productRepository = new ProductRepository(logger);

  let product: Product = await productRepository.getProduct(sellerId, countryId, sku);
  const initialStatus = product?.status;

  let listingActionChanges: Array<ListingActionChange> = [];
  if (product == null) {
    product = mapProductFromCommerceEvent(params, productCondition);
  } else {
    listingActionChanges = getListingActionChanges(
      product,
      params,
      productCondition,
      listingActionChanges,
    );
    if (listingActionChanges.length === 0 && product.status !== Status.NEW) {
      return;
    }
  }

  const amazonClient = await getAmazonClient(
    account.id,
    params.ENCRYPTION_KEY,
    params.ENCRYPTION_IV,
    logger,
  );

  if (isListingRuleMet()) {
    if (isAlreadyInAmazon(product)) {
      product.price = +params.data.value.price;
      product.stock = +params.data.value.stock_data.qty;
      product.productCondition = productCondition;
      await updateProductInAmazon(
        logger,
        account,
        params,
        marketplaceId,
        product,
        amazonClient,
        sku,
        sellerId,
        product.stock,
        listingActionChanges,
      );
    } else if (isAutomaticListEnabled) {
      await publishWhenMeetsListingRulesAndIsNotInAmazon(
        product,
        params,
        marketplaceId,
        amazonClient,
        sellerId,
        sku,
      );
    } else {
      product.status = Status.READY_TO_LIST;
    }
  } else if (isAlreadyInAmazon(product)) {
    product.price = +params.data.value.price;
    product.stock = +params.data.value.stock_data.qty;
    product.productCondition = productCondition;
    await updateProductInAmazon(
      logger,
      account,
      params,
      marketplaceId,
      product,
      amazonClient,
      sku,
      sellerId,
      0,
      listingActionChanges,
    );
    product.status = Status.INELIGIBLE;
  }
  await productRepository.saveProduct(sellerId, countryId, product, initialStatus);
  return {
    statusCode: 200,
    body: {
      product,
    },
  };
}

function getCountryName(countryId: number): CountryName {
  const country = getCountryById(countryId);
  return country?.name as CountryName;
}

function createCommunicationErrorLog(
  account: Account,
  marketplaceId: string,
  errorCode: string,
  errorMessage: string,
): CommunicationErrorLog {
  const countryName = getCountryName(account.countryId);

  return {
    id: randomUUID().toString(),
    marketplaceId,
    sellerId: account.sellerId,
    storeName: account.storeName,
    region: countryName,
    createdAt: new Date(),
    code: errorCode,
    message: errorMessage,
  };
}

interface ListingActionChange {
  name: ListingActionName;
  amount: string;
}

function createListingChange(
  account: Account,
  marketplaceId: string,
  sku: string,
  listingAction: ListingActionChange,
): ListingChange {
  const { name, amount } = listingAction;
  const countryName = getCountryName(account.countryId);
  return {
    id: randomUUID().toString(),
    marketplaceId,
    storeName: account.storeName,
    sellerId: account.sellerId,
    sellerSku: sku,
    region: countryName,
    createdAt: new Date(),
    comments: `Updated to ${amount}`,
    listingAction: name,
  };
}

async function updateProductInAmazon(
  logger: Logger,
  account: Account,
  params: Readonly<AdobeRuntime.RequestParams> &
    Readonly<AmazonSalesChannel.Model.CatalogProductSaveAfterEvent> &
    Readonly<AmazonSalesChannel.Model.CommerceId>,
  marketplaceId: string,
  product: Product,
  client: SellingPartnerAPI,
  sku: string,
  sellerId: string,
  stock: number,
  listingActionChanges: Array<ListingActionChange>,
) {
  if (product.productType == null) {
    const productType = await getProductType(client, marketplaceId, product.asin);
    if (productType?.type === 'error') {
      product.status = Status.INCOMPLETE;
      return;
    }
    product.productType = productType;
  }

  const communicationErrorLogRepository = new CommunicationErrorLogRepository(logger);

  try {
    const result = await updateProductConditionPriceAndQty(
      client,
      sku,
      marketplaceId,
      sellerId,
      stock,
      product.price,
      product.productType as string,
      product.productCondition as string,
    );

    if (result.errors) {
      const communicationErrorLog = createCommunicationErrorLog(
        account,
        marketplaceId,
        result.errors.code,
        result.errors.message,
      );
      await communicationErrorLogRepository.saveCommunicationErrorLog(communicationErrorLog);
    } else {
      const listingChangesRepository = new ListingChangesRepository(logger);
      const listingChanges: Array<Promise<ListingChange>> = [];

      listingActionChanges.forEach(listingActionChange => {
        const listingChange: ListingChange = createListingChange(
          account,
          marketplaceId,
          sku,
          listingActionChange,
        );
        listingChanges.push(listingChangesRepository.saveListingChange(listingChange));
      });
      await Promise.all(listingChanges);
    }
  } catch (error: unknown) {
    if (error instanceof UpdateProductConditionError) {
      const communicationErrorLog = createCommunicationErrorLog(
        account,
        marketplaceId,
        error.name,
        error.message,
      );
      await communicationErrorLogRepository.saveCommunicationErrorLog(communicationErrorLog);
    }
  }
}

function mapProductFromCommerceEvent(
  params: CatalogProductSaveAfterEvent,
  productCondition: string,
): Product {
  return {
    price: +params.data.value.price,
    stock: +params.data.value.stock_data.qty,
    name: params.data.value.name,
    asin: params.data.value.asin,
    sku: params.data.value.sku,
    status: Status.NEW,
    productCondition,
  };
}

type ListingActionName = 'Price' | 'Quantity' | 'Condition';

function getListingActionChanges(
  product: Product,
  params: CatalogProductSaveAfterEvent,
  productCondition: string,
  listingActionChanges: Array<ListingActionChange>,
): Array<ListingActionChange> {
  if (product.price?.toString() !== params.data.value.price) {
    listingActionChanges.push({
      name: 'Price',
      amount: Number(params.data.value.price).toFixed(2).toString(),
    });
  }
  if (product.stock?.toString() !== params.data.value.stock_data.qty) {
    listingActionChanges.push({
      name: 'Quantity',
      amount: params.data.value.stock_data.qty,
    });
  }
  if (product.productCondition !== productCondition) {
    listingActionChanges.push({ name: 'Condition', amount: productCondition });
  }
  return listingActionChanges;
}

async function publishWhenMeetsListingRulesAndIsNotInAmazon(
  product: Product,
  params: Readonly<AdobeRuntime.RequestParams> &
    Readonly<AmazonSalesChannel.Model.CatalogProductSaveAfterEvent> &
    Readonly<AmazonSalesChannel.Model.CommerceId>,
  marketplaceId: string,
  client: any,
  sellerId: string,
  sku: string,
) {
  if (product.asin == null) {
    product.status = Status.INCOMPLETE;
  } else {
    const productType = await getProductType(client, marketplaceId, product.asin);
    if (productType?.type === 'error') {
      product.status = Status.INCOMPLETE;
    } else {
      await publishProduct(
        client,
        marketplaceId,
        sellerId,
        sku,
        product.asin,
        product.stock,
        product.price,
        productType,
        product.productCondition ?? '',
      );
      product.productType = productType;
      product.status = Status.SUBMITTED;
    }
  }
}

async function getProductType(
  amazonClient: SellingPartnerAPI,
  marketplaceId: string,
  asin: string,
) {
  try {
    const resp = await getCatalogItem(amazonClient, marketplaceId, asin);
    return resp.productTypes[0].productType;
  } catch (error: any) {
    return error;
  }
}

function isListingRuleMet() {
  // @TODO implement listing rules check
  return true;
}

function isAlreadyInAmazon(product: Product) {
  return !(
    product.status === Status.INCOMPLETE ||
    product.status === Status.READY_TO_LIST ||
    product.status === Status.NEW
  );
}

function getProductCondition(
  listProductConditionId: number | undefined,
  params: CatalogProductSaveAfterEvent,
): ProductCondition {
  const PRODUCT_CONDITIONS: Record<number, ProductCondition> = {
    1: 'new_new',
    2: 'refurbished_refurbished',
    3: 'used_like_new',
    4: 'used_very_good',
    5: 'used_good',
    6: 'used_acceptable',
    7: 'collectible_like_new',
    8: 'collectible_very_good',
    9: 'collectible_good',
    10: 'collectible_acceptable',
    11: 'new_new',
  };
  const condition = PRODUCT_CONDITIONS[listProductConditionId ?? 11];
  if (
    listProductConditionId === 11 &&
    params.data.value.amazon_condition &&
    params.data.value.amazon_condition.trim().length > 0
  ) {
    const amazonCondition = params.data.value.amazon_condition as ProductCondition;
    if (Object.values(PRODUCT_CONDITIONS).includes(amazonCondition)) {
      return amazonCondition;
    }
  }
  return condition;
}
