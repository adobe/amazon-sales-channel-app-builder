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

import Account = AmazonSalesChannel.Model.Account;
import Logger from '../../../shared/logger';
import { ProductRepository } from '../repository/productRepository';
import Product = AmazonSalesChannel.Model.Product;

interface RequestParams {
  sellerId: Account['sellerId'];
  countryId: Account['countryId'];
  productStatus: Product['status'];
  size: number;
}

type Params = Readonly<AdobeRuntime.RequestParams> & Readonly<RequestParams>;

export async function main(params: Params): AdobeRuntime.Response<boolean> {
  const logger = new Logger(params.LOG_LEVEL);

  if (!params.productStatus || !params.sellerId || !params.countryId) {
    return {
      statusCode: 400,
      body: false,
    };
  }

  const productRepository = new ProductRepository(logger);

  const skus = await productRepository.getSkusByType(
    params.sellerId,
    params.countryId,
    params.productStatus,
  );

  let productsDeleted = 0;
  for (const sku of skus) {
    try {
      await productRepository.deleteProduct(params.sellerId, params.countryId, sku);
      productsDeleted += 1;
    } catch (error) {
      logger.error('Could not delete an sku', { params, sku }, error);
    }
  }

  logger.info('Products deleted', { params, productsDeleted });

  return {
    statusCode: 200,
    body: true,
  };
}
