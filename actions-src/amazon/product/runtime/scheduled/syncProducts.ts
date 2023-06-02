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

import { errorResponse } from '../../../../shared/utils';
import { getListingsItems, getMerchantListingsReport } from '../../../amazonSpApi';
import Logger from '../../../../shared/logger';
import { AttributeRepository } from '../../../../api/attribute/repository/attributeRepository';
import { ProductRepository } from '../../../../api/product/repository/productRepository';
import { AdobeCommerceApi } from '../../../../commerce/adobeCommerceApi';
import { getAmazonClient, getCredentials } from '../../../../shared/getAmazonClient';
import CommerceId = AmazonSalesChannel.Model.CommerceId;
import Product = AmazonSalesChannel.Model.Product;
import Status = AmazonSalesChannel.Model.Status;
import AttributeMap = AmazonSalesChannel.Model.AttributeMap;
import AttributeValue = AmazonSalesChannel.Model.AttributeValue;
import EncryptionRequest = AdobeRuntime.EncryptionRequest;
import { getCountryById } from '../../../../shared/localization/country';
import { AccountRepository } from '../../../../api/account/repository/accountRepository';

type Params = Readonly<AdobeRuntime.RequestParams> &
  Readonly<EncryptionRequest> &
  Readonly<CommerceId>;

const errorResponseHandler = errorResponse as AdobeRuntime.ErrorResponseHandler;

export async function main(params: Params) {
  const logger = new Logger(params.LOG_LEVEL);
  const adobeCommerceApi = new AdobeCommerceApi(params, logger);
  const attributeRepository = new AttributeRepository(logger);

  async function saveProduct(
    report: any,
    amazonListings: any,
    sellerId: string,
    countryId: number,
  ) {
    try {
      const productData: Product = {
        status: report.status.toUpperCase(),
        asin: report.asin1,
        sku: report.sku,
        price: Number(
          amazonListings.attributes?.purchasable_offer?.[0].our_price?.[0].schedule?.[0]
            .value_with_tax || 0,
        ),
        stock: Number(amazonListings.attributes?.fulfillment_availability?.[0].quantity || 0),
        name: report.itemName,
        productType: amazonListings.summaries[0].productType,
        attributes: [],
      };

      logger.debug('After mapping product data', productData);
      const productRepository = new ProductRepository(logger);
      const product = await productRepository.getProduct(sellerId, countryId, productData.sku);
      logger.debug('Product from DB', product);
      if (product === null) {
        logger.debug('Product not found in DB', {
          sellerId,
          countryId,
          productObject: productData,
        });
        if (await isProductThirdParty(adobeCommerceApi, productData)) {
          logger.debug('Product not found in commerce and is thirdParty', {
            sellerId,
            countryId,
            productObject: productData,
          });
          productData.status = Status.NEW_THIRD_PARTY;
        }
        logger.debug('Product listing status', {
          sellerId,
          countryId,
          productObject: productData,
        });

        await productRepository.saveProduct(sellerId, countryId, productData);
        logger.debug('Product created', { sellerId, countryId, productObject: productData });
      } else {
        logger.debug('Product found in DB', {
          sellerId,
          countryId,
          productObject: productData,
        });
        const initialStatus = product.status;
        if (
          initialStatus === Status.NEW_THIRD_PARTY &&
          (await isProductThirdParty(adobeCommerceApi, productData))
        ) {
          productData.status = Status.NEW_THIRD_PARTY;
        }

        await productRepository.saveProduct(sellerId, countryId, productData, initialStatus);
        logger.debug('Product updated', { sellerId, countryId, productObject: productData });
      }
    } catch (error) {
      logger.error('The product could not be imported', { report }, error);
      throw new Error('Product cannot be imported');
    }
  }

  async function saveAttributes(amazonListings: any) {
    try {
      const marketplaceId = amazonListings.summaries[0].marketplaceId;
      const asin = amazonListings.summaries[0].asin;
      const sku = amazonListings.sku;
      const attributes = amazonListings.attributes;
      const savedAttributesPromises = [];
      for (const attributeName in attributes) {
        if (Object.hasOwn(attributes, attributeName)) {
          switch (attributeName) {
            case 'SmallImage': {
              let image = attributes[attributeName][0].URL;
              savedAttributesPromises.push(
                saveAttributeValue(
                  marketplaceId,
                  'Thumbnail',
                  sku,
                  asin,
                  image,
                  attributeRepository,
                ),
              );
              image = image.replace('_SL75_', '_SL160_');
              savedAttributesPromises.push(
                saveAttributeValue(
                  marketplaceId,
                  'SmallImage',
                  sku,
                  asin,
                  image,
                  attributeRepository,
                ),
              );
              image = image.replace('_SL160_', '_SL355_');
              savedAttributesPromises.push(
                saveAttributeValue(
                  marketplaceId,
                  'LargeImage',
                  sku,
                  asin,
                  image,
                  attributeRepository,
                ),
              );
              break;
            }
            case 'list_price': {
              const listPrice = attributes[attributeName][0].value_with_tax;
              if (listPrice === undefined) {
                break;
              }
              savedAttributesPromises.push(
                saveAttributeValue(
                  marketplaceId,
                  'AmazonListPrice',
                  sku,
                  asin,
                  listPrice,
                  attributeRepository,
                ),
              );
              break;
            }
            case 'item_package_dimensions': {
              ['Length', 'Width', 'Height'].forEach((dimensionKey: string) => {
                const dimensionValue =
                  attributes[attributeName][0][dimensionKey.toLowerCase()]?.value;
                if (!dimensionValue) {
                  return;
                }
                savedAttributesPromises.push(
                  saveAttributeValue(
                    marketplaceId,
                    `PackageDimensions${dimensionKey}`,
                    sku,
                    asin,
                    dimensionValue,
                    attributeRepository,
                  ),
                );
              });
              break;
            }
            case 'item_dimensions': {
              ['Length', 'Width', 'Height'].forEach((dimensionKey: string) => {
                const dimensionValue =
                  attributes[attributeName][0][dimensionKey.toLowerCase()]?.value;
                if (!dimensionValue) {
                  return;
                }
                savedAttributesPromises.push(
                  saveAttributeValue(
                    marketplaceId,
                    `ItemDimensions${dimensionKey}`,
                    sku,
                    asin,
                    dimensionValue,
                    attributeRepository,
                  ),
                );
              });
              break;
            }
            default: {
              savedAttributesPromises.push(
                saveAttributeValue(
                  marketplaceId,
                  attributeName,
                  sku,
                  asin,
                  attributes[attributeName][0].value,
                  attributeRepository,
                ),
              );
            }
          }
        }
      }
      await Promise.all(savedAttributesPromises);
    } catch (error) {
      logger.error('The product could not be imported', {}, error);
      throw new Error('Attributes cannot be saved');
    }
  }

  async function getListingsItem(
    amazonClient: any,
    marketplaceId: string,
    sellerId: string,
    report: any,
    countryId: number,
  ) {
    const amazonListing = await getListingsItems(amazonClient, marketplaceId, sellerId, report.sku);

    logger.debug('Got listing item', amazonListing);
    await saveProduct(report, amazonListing, sellerId, countryId);
    await saveAttributes(amazonListing);
  }

  try {
    logger.info('Start retrieving Amazon product updates');

    const accountRepository = new AccountRepository(logger);
    const accounts = await accountRepository.getAccounts();

    for (const [id, account] of Object.entries(accounts)) {
      try {
        const country = getCountryById(account.countryId);
        if (country !== undefined) {
          const marketplaceId: string = country.marketplaceId;
          const { sellerId, countryId } = account;
          logger.debug('Start updating products by account', { sellerId, countryId });
          const listingItems = [];
          const credentialsResponse = await getCredentials(
            account.id,
            params.ENCRYPTION_KEY,
            params.ENCRYPTION_IV,
            logger,
          );
          const batchReport = await getMerchantListingsReport(
            credentialsResponse,
            'GET_MERCHANT_LISTINGS_ALL_DATA',
            marketplaceId,
            logger,
          );
          logger.info('Listing reports returned from Amazon', { reportCount: batchReport.length });

          const client = await getAmazonClient(
            account.id,
            params.ENCRYPTION_KEY,
            params.ENCRYPTION_IV,
            logger,
          );

          for (const report of batchReport) {
            try {
              logger.debug('Product report data', { row: report, sellerId, countryId });
              listingItems.push(
                getListingsItem(client, marketplaceId, sellerId, report, countryId),
              );
            } catch (error) {
              logger.error(
                'Unexpected error while importing Amazon listing items',
                { report },
                error,
              );
            }
          }
          await Promise.all(listingItems);
        }
      } catch (error) {
        logger.error('Cannot sync products for account', { account }, error);
      }
    }
    logger.info('Finished retrieving Amazon product updates');

    return {
      statusCode: 200,
      body: { response: {} },
    };
  } catch (error) {
    logger.error('Cannot sync products', {}, error);
    return errorResponseHandler(500, 'Server Error', logger);
  }

  async function isProductThirdParty(
    adobeCommerceApi: AdobeCommerceApi,
    productData: AmazonSalesChannel.Model.Product,
  ) {
    const commerceResponse = (await adobeCommerceApi.getProduct(productData.asin)) as {
      items: Array<{ sku: string }>;
    };

    return commerceResponse.items.length === 0;
  }
}

async function saveAttributeValue(
  marketplaceId: string,
  attributeName: string,
  sku: string,
  asin: string,
  amazonValue: string,
  attributeRepository: AttributeRepository,
) {
  attributeName = snakeCaseToPascalCase(attributeName);
  let attribute: AttributeMap = await attributeRepository.getAttribute(
    marketplaceId,
    attributeName,
  );

  const attributeValue: AttributeValue = {
    sku,
    asin,
    amazonValue,
    status: false,
  };

  if (attribute) {
    if (attribute.values !== undefined && sku in attribute.values) {
      attribute.values[sku].amazonValue = amazonValue;
    } else if (attribute.values === undefined) {
      attribute.values = { sku: attributeValue };
    } else {
      attribute.values[sku] = attributeValue;
    }
  } else {
    attribute = {
      marketplaceId,
      amazonAttributeName: attributeName,
      overwriteMagentoValues: false,
      status: false,
      values: { sku: attributeValue },
    };
  }

  await attributeRepository.saveAttribute(attribute);
}

function snakeCaseToPascalCase(str: any) {
  const camelCase = snakeToCamel(str);
  return camelCase[0].toUpperCase() + camelCase.slice(1);
}

function snakeToCamel(str: string): string {
  return str.replace(/([_-]\w)/g, g => g[1].toUpperCase());
}
