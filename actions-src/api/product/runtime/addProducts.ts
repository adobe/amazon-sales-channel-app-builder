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

  const size: number = Number(params.size) ?? 250;

  if (!params.productStatus || !params.sellerId || !params.countryId) {
    return {
      statusCode: 400,
      body: false,
    };
  }

  const skus = [...Array.from({ length: size }).keys()].map(
    id => `SKU_${params.productStatus}_${id + 1}`,
  );

  logger.info('Skus to create', {
    skusToCreateCount: skus.length,
    size,
    productStatus: params.productStatus,
    sellerId: params.sellerId,
    countryId: params.countryId,
  });

  const productRepository = new ProductRepository(logger);

  let skusSaved = 0;
  for (const sku of skus) {
    await productRepository.saveProduct(params.sellerId, params.countryId, {
      asin: `ASIN_${sku}`,
      sku,
      status: params.productStatus,
      price: 1,
      stock: 2,
      name: `${sku}_name`,
      attributes: [],
    });

    skusSaved++;
  }

  logger.info('Skus saved at DB', {
    skusSavedCount: skusSaved,
    price: 1,
    stock: 2,
    productStatus: params.productStatus,
    sellerId: params.sellerId,
    countryId: params.countryId,
  });

  return {
    statusCode: 200,
    body: true,
  };
}
