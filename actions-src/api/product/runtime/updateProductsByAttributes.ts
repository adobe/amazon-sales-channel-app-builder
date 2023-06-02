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

import { errorResponse } from '../../../shared/utils';

import Account = AmazonSalesChannel.Model.Account;
import Logger from '../../../shared/logger';
import { AdobeCommerceApi } from '../../../commerce/adobeCommerceApi';

interface RequestParams {
  sellerId: Account['sellerId'];
  countryId: number;
  attributeName: string;
  attributeValue: string;
  newAttributeValue: string;
}

type Params = Readonly<AdobeRuntime.RequestParams> & Readonly<RequestParams>;

const errorResponseHandler = errorResponse as AdobeRuntime.ErrorResponseHandler;

export async function main(params: Params) {
  const logger = new Logger(params.LOG_LEVEL);
  const { sellerId, countryId, attributeName, attributeValue, newAttributeValue } = params;

  try {
    const adobeCommerceApi = new AdobeCommerceApi(params, logger);
    const startedGetAt = Date.now();
    logger.info('Get commerce product', { startedGetAt });
    const products = (await adobeCommerceApi.getProductsByAttribute(
      attributeName,
      attributeValue,
    )) as {
      items: Array<{ sku: string }>;
    };
    const endGetAt = Date.now();
    logger.info('Commerce products received', {
      count: products.items.length,
      endGetAt,
      elapsedTime: (endGetAt - startedGetAt) / 1000,
    });

    const startedUpdateAt = Date.now();
    logger.info('Update commerce products', { startedUpdateAt });
    const productByAttributePromises: Array<Promise<any>> = [];
    products.items.forEach((product: { sku: string }) => {
      const productByAttributePromise = adobeCommerceApi.updateProductAttribute(
        product.sku,
        attributeName,
        newAttributeValue,
      );
      productByAttributePromises.push(productByAttributePromise);
    });

    const productByAttributes = await Promise.all(productByAttributePromises);
    const endUpdateAt = Date.now();
    logger.info('Commerce products updated', {
      count: productByAttributes.length,
      endUpdateAt,
      elapsedTime: (endUpdateAt - startedUpdateAt) / 1000,
    });

    return {
      statusCode: 200,
      body: {
        productsReceivedCount: products.items.length,
        productsUpdatedCount: productByAttributes.length,
        startedGetAt,
        endGetAt,
        elapsedGetAt: (endGetAt - startedGetAt) / 1000,
        startedUpdateAt,
        endUpdateAt,
        elapsedUpdateAt: (endUpdateAt - startedUpdateAt) / 1000,
      },
    };
  } catch (error: unknown) {
    logger.error(
      'Request to get products failed',
      { sellerId, countryId, attributeName, attributeValue },
      error,
    );
    return errorResponseHandler(500, 'Server error', logger);
  }
}
