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
import Logger from '../../../shared/logger';
import { ProductRepository } from '../repository/productRepository';
import { InputProductValidation } from './validation/inputProductValidation';
import { findPage } from '../../../shared/pagination';
import Collection = AmazonSalesChannel.Collection;
import Account = AmazonSalesChannel.Model.Account;
import Product = AmazonSalesChannel.Model.Product;

interface RequestParams {
  sellerId: Account['sellerId'];
  countryId: number;
  productStatus: Product['status'];
  currentPage?: number;
}

type Params = Readonly<AdobeRuntime.RequestParams> & Readonly<RequestParams>;

const errorResponseHandler = errorResponse as AdobeRuntime.ErrorResponseHandler;
const ITEMS_PER_PAGE = 300;
const DEFAULT_PAGE = 1;

export async function main(params: Params): AdobeRuntime.Response<Collection<Product>> {
  const logger = new Logger(params.LOG_LEVEL);
  const { sellerId, countryId, productStatus: inputProductStatus } = params;

  try {
    logger.info('Get products', {
      sellerId,
      countryId,
      inputProductStatus,
    });

    const inputProductValidation = new InputProductValidation(logger);
    const productStatus = inputProductValidation.transform(inputProductStatus);

    const productRepository = new ProductRepository(logger);
    const productSkus = await productRepository.getSkusByType(sellerId, countryId, productStatus);

    let total = productSkus.length;
    const currentPage = params.currentPage ?? DEFAULT_PAGE;
    const subsetSkus = findPage(productSkus, total, currentPage, ITEMS_PER_PAGE);
    const promises: Array<Promise<Product>> = [];

    for (const sku of subsetSkus) {
      const productPromise = productRepository.getProduct(sellerId, countryId, sku);
      promises.push(productPromise);
    }

    const products = await Promise.all(promises);
    const missingSkus = new Set(subsetSkus);

    const collection: Array<Product> = [];

    for (const product of products) {
      if (product && missingSkus.has(product.sku)) {
        missingSkus.delete(product.sku);
        collection.push(product);
      }
    }

    total -= missingSkus.size;

    if (total !== productSkus.length) {
      logger.warn(
        'Some inconsistencies were found in the database. Please fix them to avoid further issues',
        {
          missingSkus: [...missingSkus.values()],
          productsByStatusCount: total,
          productsCount: productSkus.length,
        },
      );
    }

    logger.info('Products found', {
      sellerId,
      countryId,
      productStatus,
      productSkusCount: productSkus.length,
      total,
      currentPage,
    });

    return {
      statusCode: 200,
      body: {
        collection,
        total,
        count: products.length,
        pagination: {
          currentPage,
          lastPage: Math.ceil(total / ITEMS_PER_PAGE),
        },
      },
    };
  } catch (error: unknown) {
    logger.error(
      'Request to get products failed',
      { sellerId, countryId, inputProductStatus },
      error,
    );
    return errorResponseHandler(500, 'Server error', logger);
  }
}
