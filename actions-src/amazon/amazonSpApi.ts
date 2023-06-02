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
import { ReportDocument } from 'amazon-sp-api/lib/typings/operations/reports';
import { BaseResponse } from 'amazon-sp-api/lib/typings/baseTypes';
import { ReportDocumentType } from 'amazon-sp-api/lib/typings/download';
import Logger from '../shared/logger';
import { AmazonApiInitError } from './amazonApiInitError';
import GetCredentialsResponse = AmazonSalesChannel.Model.GetCredentialsResponse;
import AmazonAllDataReport = AmazonSalesChannel.Model.AmazonAllDataReport;
import AmazonImpReport = AmazonSalesChannel.Model.AmazonImpReport;
import AmazonOrder = AmazonSalesChannel.Model.AmazonOrder;
import AmazonOrderItem = AmazonSalesChannel.Model.AmazonOrderItem;

const REPORT_PROCESSING_STATUS_DONE = 'DONE';
const GET_MERCHANT_LISTINGS_ALL_DATA = 'GET_MERCHANT_LISTINGS_ALL_DATA';

interface AmazonApiConfigRequest {
  SP_API_REGION?: 'na' | 'eu' | 'fe';
  SP_API_USE_SANDBOX?: false;
  AUTO_REQUEST_THROTTLED?: true;
}

type Params = Readonly<GetCredentialsResponse> & Readonly<AmazonApiConfigRequest>;

export function getAmazonClient(params: Params, logger: Logger) {
  let sellingPartnerApi;
  try {
    sellingPartnerApi = new SellingPartnerAPI({
      region: params.SP_API_REGION ?? 'na',
      refresh_token: params.refreshToken,
      credentials: {
        SELLING_PARTNER_APP_CLIENT_ID: params.credentials.sellingPartnerAppClientId,
        SELLING_PARTNER_APP_CLIENT_SECRET: params.credentials.sellingPartnerAppClientSecret,
        AWS_ACCESS_KEY_ID: params.credentials.awsAccessKeyId,
        AWS_SECRET_ACCESS_KEY: params.credentials.awsAccessKeySecret,
        AWS_SELLING_PARTNER_ROLE: params.credentials.awsSellingPartnerRole,
      },
      options: {
        use_sandbox: params.SP_API_USE_SANDBOX ?? false,
        auto_request_throttled: params.AUTO_REQUEST_THROTTLED ?? true,
      },
    });
  } catch (error) {
    logger.error('Cannot initialize Amazon API client', {}, error);
  }

  if (sellingPartnerApi === undefined) {
    throw new AmazonApiInitError('Failed to initialized Selling Partner Api');
  }

  return sellingPartnerApi;
}

export async function getOrders(
  client: SellingPartnerAPI,
  logger: Logger,
  marketplaceId: string,
  createdAfter: Date,
) {
  try {
    return (await client.callAPI({
      operation: 'orders.getOrders',
      options: { version: 'v0' },
      query: {
        MarketplaceIds: [marketplaceId],
        CreatedAfter: createdAfter.toISOString(),
      },
      path: {},
    })) as Array<AmazonOrder>;
  } catch (error: unknown) {
    logger.error('HTTP request failed to get orders', {}, error);
    throw new Error('HTTP request failed to get orders');
  }
}

export async function getOrderItems(client: SellingPartnerAPI, orderId: string) {
  try {
    return (await client.callAPI({
      operation: 'orders.getOrderItems',
      options: { version: 'v0' },
      path: { orderId },
    })) as Array<AmazonOrderItem>;
  } catch {
    throw new Error('HTTP request failed to get order items');
  }
}

async function getLatestListingReport(
  client: SellingPartnerAPI,
  marketplaceId: string,
  reportType: string,
) {
  try {
    return await client.callAPI({
      operation: 'reports.getReports',
      options: { version: '2021-06-30' },
      query: {
        reportTypes: [reportType],
        marketplaceIds: [marketplaceId],
        processingStatuses: [REPORT_PROCESSING_STATUS_DONE],
        pageSize: 1,
      },
      path: {},
    });
  } catch {
    throw new Error('HTTP request failed to get catalog items');
  }
}

interface PatchListingsItem extends BaseResponse {
  sku: string;
}

export class UpdateProductConditionError extends Error {
  constructor(message: string) {
    super(message);

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

export async function updateProductConditionPriceAndQty(
  client: SellingPartnerAPI,
  sku: string,
  marketplaceId: string,
  sellerId: string,
  quantity: number,
  price: number,
  productType: string,
  productCondition: string,
): Promise<PatchListingsItem> {
  try {
    return (await client.callAPI({
      operation: 'listingsItems.patchListingsItem',
      options: { version: '2021-08-01' },
      query: {
        marketplaceIds: [marketplaceId],
      },
      path: {
        sellerId,
        sku,
      },
      body: {
        productType,
        patches: [
          {
            op: 'replace',
            path: '/attributes/purchasable_offer',
            value: [
              {
                marketplace_id: marketplaceId,
                currency: 'USD',
                our_price: [
                  {
                    schedule: [
                      {
                        value_with_tax: price,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            op: 'replace',
            path: '/attributes/fulfillment_availability',
            value: [
              {
                fulfillment_channel_code: 'DEFAULT',
                quantity,
              },
            ],
          },
          {
            op: 'replace',
            path: '/attributes/condition_type',
            value: [
              {
                value: productCondition,
                marketplace_id: marketplaceId,
              },
            ],
          },
        ],
      },
    })) as PatchListingsItem;
  } catch {
    throw new UpdateProductConditionError('HTTP request failed to patch listing items');
  }
}

export async function publishProduct(
  client: SellingPartnerAPI,
  marketplaceId: string,
  sellerId: string,
  sku: string,
  asin: string,
  quantity: number,
  price: number,
  productType: string,
  productCondition: string,
) {
  await client.callAPI({
    operation: 'listingsItems.putListingsItem',
    options: { version: '2021-08-01' },
    query: {
      marketplaceIds: [marketplaceId],
    },
    path: {
      sellerId,
      sku,
    },
    body: {
      productType,
      attributes: {
        condition_type: [
          {
            value: productCondition,
            marketplace_id: marketplaceId,
          },
        ],
        merchant_suggested_asin: [
          {
            value: asin,
            marketplace_id: marketplaceId,
          },
        ],
        fulfillment_availability: [
          {
            fulfillment_channel_code: 'DEFAULT',
            quantity,
          },
        ],
        purchasable_offer: [
          {
            currency: 'USD',
            our_price: [
              {
                schedule: [
                  {
                    value_with_tax: price,
                  },
                ],
              },
            ],
            marketplace_id: marketplaceId,
          },
        ],
      },
      requirements: 'LISTING_OFFER_ONLY',
    },
  });
}

export async function getMerchantListingsReport(
  credentialsResponse: GetCredentialsResponse,
  reportType: string,
  marketplaceId: string,
  logger: Logger,
): Promise<Array<AmazonAllDataReport | AmazonImpReport>> {
  async function getReportDocument(
    client: SellingPartnerAPI,
    documentId: string,
    logger: Logger,
  ): Promise<Array<AmazonAllDataReport | AmazonImpReport>> {
    try {
      const reportDocumentResponse: ReportDocument = await client.callAPI({
        operation: 'reports.getReportDocument',
        options: { version: '2021-06-30' },
        path: {
          reportDocumentId: documentId,
        },
      });

      if (!reportDocumentResponse) {
        return [];
      }

      logger.info('Report document retrieved successfully', reportDocumentResponse);
      const reportDocument: ReportDocumentType = await client.download(reportDocumentResponse, {
        json: true,
      });

      logger.info('Report document downloaded', reportDocument);

      if (reportType === GET_MERCHANT_LISTINGS_ALL_DATA) {
        return reportDocument.map(
          (report: { [x: string]: string; status: string; asin1: string }) => ({
            sku: report['seller-sku'],
            status: report.status,
            asin: report.asin1,
            itemName: report['item-name'],
          }),
        );
      }
      return reportDocument;
    } catch (error: unknown) {
      logger.error('HTTP request failed to get report document', documentId, error);
      throw new Error('HTTP request failed to get report document');
    }
  }

  try {
    const client = getAmazonClient(credentialsResponse, logger);
    const listingsReports = await getLatestListingReport(client, marketplaceId, reportType);

    if (listingsReports.length === 0) {
      return [];
    }
    const reportDocumentId = listingsReports.reports[0].reportDocumentId;

    return await getReportDocument(client, reportDocumentId, logger);
  } catch (error) {
    logger.error('Cannot parse report', reportType, error);
    throw new Error('Cannot parse report');
  }
}

export async function getCatalogItem(
  amazonClient: SellingPartnerAPI,
  marketplaceId: string,
  asin: string,
) {
  try {
    return await amazonClient.callAPI({
      operation: 'catalogItems.getCatalogItem',
      options: { version: '2020-12-01' },
      query: {
        MarketplaceId: marketplaceId,
        includedData: ['productTypes'],
      },
      path: {
        asin,
      },
    });
  } catch {
    throw new Error('HTTP request failed to get catalog items');
  }
}

export async function getCompetitivePrices(
  amazonClient: SellingPartnerAPI,
  marketplaceId: string,
  skus: Array<string>,
) {
  try {
    return await amazonClient.callAPI({
      operation: 'productPricing.getCompetitivePricing',
      options: { version: 'v0' },
      query: {
        MarketplaceId: marketplaceId,
        ItemType: 'Sku',
        Skus: skus,
      },
    });
  } catch {
    throw new Error('HTTP request failed to get competitive prices');
  }
}

export async function getListingOffers(
  amazonClient: SellingPartnerAPI,
  marketplaceId: string,
  skus: Array<string>,
) {
  try {
    const requests: {
      ItemCondition: string;
      MarketplaceId: any;
      method: string;
      uri: string;
      headers: {};
    }[] = [];
    skus.forEach((sku: any) =>
      requests.push({
        ItemCondition: 'New',
        MarketplaceId: marketplaceId,
        method: 'GET',
        uri: `/products/pricing/v0/listings/${sku}/offers`,
        headers: {},
      }),
    );

    return await amazonClient.callAPI({
      operation: 'productPricing.getListingOffersBatch',
      options: { version: 'v0' },
      body: { requests },
      path: {},
    });
  } catch {
    throw new Error('HTTP request failed to get listing offers');
  }
}

export async function getOrderMetrics(
  amazonClient: SellingPartnerAPI,
  logger: Logger,
  marketplaceId: string,
  minDate: Date,
  maxDate: Date,
) {
  try {
    return await amazonClient.callAPI({
      operation: 'sales.getOrderMetrics',
      options: { version: 'v1' },
      query: {
        marketplaceIds: [marketplaceId],
        interval: `${minDate.toISOString()}--${maxDate.toISOString()}`,
        granularity: 'Day',
      },
    });
  } catch (error: unknown) {
    logger.error('HTTP request failed to get order metrics', {}, error);
    throw new Error('HTTP request failed to get order metrics');
  }
}

export async function getListingsItems(
  amazonClient: SellingPartnerAPI,
  marketplaceId: string,
  sellerId: string,
  sku: string,
) {
  try {
    return await amazonClient.callAPI({
      operation: 'listingsItems.getListingsItem',
      query: {
        marketplaceIds: [marketplaceId],
        includedData: ['attributes', 'summaries'],
      },
      path: {
        sellerId,
        sku,
      },
    });
  } catch {
    throw new Error('HTTP request failed to get listing items');
  }
}
