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
import Product = AmazonSalesChannel.Model.Product;
import ProductCounter = AmazonSalesChannel.Model.ProductCounter;
import { ProductRepository } from '../repository/productRepository';
import { InputProductValidation } from './validation/inputProductValidation';

interface RequestParams {
  sellerId: Account['sellerId'];
  countryId: number;
  productStatus: Product['status'];
}

type Params = Readonly<AdobeRuntime.RequestParams> & Readonly<RequestParams>;

const errorResponseHandler = errorResponse as AdobeRuntime.ErrorResponseHandler;

export async function main(params: Params): AdobeRuntime.Response<ProductCounter> {
  const logger = new Logger(params.LOG_LEVEL);
  const { sellerId, countryId, productStatus: inputProductStatus } = params;

  try {
    logger.info('Count products', {
      sellerId,
      countryId,
      inputProductStatus,
    });

    const inputProductValidation = new InputProductValidation(logger);
    const productStatus = inputProductValidation.transform(inputProductStatus);

    const productRepository = new ProductRepository(logger);

    const productSkus = await productRepository.getSkusByType(sellerId, countryId, productStatus);

    const total = productSkus.length ?? 0;

    logger.info('Products counted', {
      sellerId,
      countryId,
      productStatus,
      productsCount: total,
    });

    return {
      statusCode: 200,
      body: {
        count: total,
      },
    };
  } catch (error: unknown) {
    logger.error(
      'Request to count products failed',
      { sellerId, countryId, inputProductStatus },
      error,
    );
    return errorResponseHandler(500, 'Failed to count products', logger);
  }
}
