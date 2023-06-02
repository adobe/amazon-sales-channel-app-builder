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
import Product = AmazonSalesChannel.Model.Product;
import { ProductRepository } from '../../product/repository/productRepository';

interface RequestParams {
  websiteId: Account['websiteId'];
  sellerId: Account['sellerId'];
  countryId: Account['countryId'];
  productStatus: Product['status'];
}

type Params = Readonly<AdobeRuntime.RequestParams> & Readonly<RequestParams>;

export async function main(params: Params): AdobeRuntime.Response<boolean> {
  const logger = new Logger(params.LOG_LEVEL);

  if (!params.productStatus || !params.websiteId || !params.countryId || !params.sellerId) {
    return {
      statusCode: 400,
      body: false,
    };
  }

  const productRepository = new ProductRepository(logger);
  const state = await productRepository.getState();
  const resSkus = await state.get(`${params.websiteId}-${params.productStatus}`.toUpperCase());

  const skus = resSkus?.value ?? [];
  logger.info('Skus to migrate', { skusCount: skus.length });
  let skusMigrated = 0;
  for (const index in skus) {
    if (Object.hasOwn(skus, index)) {
      const sku = skus[index];
      const res = await state.get(`${params.websiteId}-${sku}`.toUpperCase());
      const currentProduct = res?.value ?? null;
      if (currentProduct == null) {
        logger.info('Sku migration skipped', { sku, params });
        continue;
      }
      logger.info('Sku migration started', { sku, params });

      await productRepository.saveProduct(params.sellerId, params.countryId, {
        sku,
        status: currentProduct.status.toUpperCase(),
        price: currentProduct.price,
        stock: currentProduct.stock,
        name: currentProduct.name,
        attributes: currentProduct.attributes,
        asin: currentProduct.asin,
        productType: currentProduct.productType,
        productCondition: currentProduct.productCondition,
      });

      logger.info('new product saved', {
        product: await productRepository.getProduct(params.sellerId, params.countryId, sku),
      });

      await state.delete(`${params.websiteId}-${sku}`.toUpperCase());
      logger.info('Sku migration finished', { sku, params });
      skusMigrated++;
    }
  }

  logger.info('Cleanup migration finished', { params });
  await state.delete(`${params.websiteId}-${params.productStatus}`.toUpperCase());

  logger.info('Skus saved at DB', {
    skusMigratedCount: skusMigrated,
    productStatus: params.productStatus,
    sellerId: params.sellerId,
    countryId: params.countryId,
  });

  return {
    statusCode: 200,
    body: true,
  };
}
