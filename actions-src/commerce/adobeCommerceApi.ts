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

import { getCommerceOauthClient } from './oauth1a';
import Logger from '../shared/logger';

export class AdobeCommerceApi {
  private readonly logger: Logger;

  private readonly oAuthClient;

  constructor(params: any, logger: Logger) {
    this.logger = logger;

    this.oAuthClient = getCommerceOauthClient(
      {
        url: params.COMMERCE_BASE_URL,
        consumerKey: params.COMMERCE_CONSUMER_KEY,
        consumerSecret: params.COMMERCE_CONSUMER_SECRET,
        accessToken: params.COMMERCE_ACCESS_TOKEN,
        accessTokenSecret: params.COMMERCE_ACCESS_TOKEN_SECRET,
      },
      logger,
    );
  }

  async getProduct(asin: string) {
    return this.oAuthClient.get(
      `products?searchCriteria[filter_groups][0][filters][0][field]=asin&searchCriteria[filter_groups][0][filters][0][value]=${asin}`,
    );
  }

  async getProductsByAttribute(attribute: string, value: string) {
    return this.oAuthClient.get(
      `products?searchCriteria[filter_groups][0][filters][0][field]=${attribute}&searchCriteria[filter_groups][0][filters][0][value]=${value}`,
    );
  }

  async updateProductAttribute(sku: string, attribute: string, value: string) {
    return this.oAuthClient.put(`products/${sku}`, {
      product: {
        sku,
        custom_attributes: [
          {
            attribute_code: attribute,
            value,
          },
        ],
      },
    });
  }

  async updatePrice(sku: string, price: number, websiteId = 0) {
    return this.oAuthClient.post('products/base-prices', {
      prices: [
        {
          price,
          store_id: websiteId,
          sku,
        },
      ],
    });
  }
}
