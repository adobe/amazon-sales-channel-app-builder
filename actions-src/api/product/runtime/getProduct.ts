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
import Product = AmazonSalesChannel.Model.Product;
import Account = AmazonSalesChannel.Model.Account;
import Logger from '../../../shared/logger';
import { ProductRepository } from '../repository/productRepository';

interface RequestParams {
  sellerId: Account['sellerId'];
  countryId: Account['countryId'];
  sku: string;
}

type Params = Readonly<AdobeRuntime.RequestParams> & Readonly<RequestParams>;

const errorResponseHandler = errorResponse as AdobeRuntime.ErrorResponseHandler;

export async function main(params: Params): AdobeRuntime.Response<Product> {
  const logger = new Logger(params.LOG_LEVEL);
  const { sellerId, countryId, sku } = params;

  try {
    const productRepository = new ProductRepository(logger);

    logger.info('Get product', { sellerId, countryId, sku });

    const product: Product = await productRepository.getProduct(sellerId, countryId, sku);
    if (!product) {
      return {
        statusCode: 404,
        body: product,
      };
    }

    logger.info('Product found', { sellerId, countryId, sku });

    return {
      statusCode: 200,
      body: product,
    };
  } catch (error: unknown) {
    logger.error('Request to get product failed', { sellerId, countryId, sku }, error);
    return errorResponseHandler(500, 'Server error', logger);
  }
}
