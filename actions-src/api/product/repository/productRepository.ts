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

import { init, StateStore } from '@adobe/aio-lib-state';
import { randomUUID } from 'node:crypto';
import Account = AmazonSalesChannel.Model.Account;
import Logger from '../../../shared/logger';
import Product = AmazonSalesChannel.Model.Product;

export class ProductRepository {
  private state: StateStore | undefined;

  private readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  static buildSellerSkuKey(sellerId: string, countryId: number, sku: string): string {
    return `${sellerId}-${countryId}-${sku}`.toUpperCase();
  }

  static buildSellerStatusKey(sellerId: string, countryId: number, status: string): string {
    return `${sellerId}-${countryId}-${status}`.toUpperCase();
  }

  async getState() {
    if (!this.state) {
      this.state = await init();
    }
    return this.state;
  }

  async getSkusByType(
    sellerId: Account['sellerId'],
    countryId: number,
    status: Product['status'],
  ): Promise<Array<string>> {
    this.state = await this.getState();
    const res = await this.state.get(
      ProductRepository.buildSellerStatusKey(sellerId, countryId, status),
    );
    return res?.value ?? [];
  }

  async getProduct(
    sellerId: Account['sellerId'],
    countryId: number,
    sku: string,
  ): Promise<Product> {
    this.state = await this.getState();
    const res = await this.state.get(ProductRepository.buildSellerSkuKey(sellerId, countryId, sku));
    return res?.value ?? null;
  }

  async saveProduct(
    sellerId: Account['sellerId'],
    countryId: number,
    product: any,
    initialStatus?: string,
  ) {
    if (product.id == null) {
      product.id = randomUUID();
      this.state = await this.getState();
      await this.state.put(
        ProductRepository.buildSellerSkuKey(sellerId, countryId, product.sku),
        product,
        {
          ttl: -1,
        },
      );
      await this.addSkuToProductStatus(sellerId, countryId, product.status, product.sku);
    } else {
      await this.updateProduct(sellerId, countryId, product, initialStatus);
    }
  }

  async addSkuToProductStatus(
    sellerId: Account['sellerId'],
    countryId: number,
    status: Product['status'],
    sku: string,
  ) {
    let currentSkus: string[] = [];
    await this.getSkusByType(sellerId, countryId, status).then(res => {
      currentSkus = res;
    });

    currentSkus = [...new Set([...currentSkus, sku])];

    this.state = await this.getState();
    await this.state.put(
      ProductRepository.buildSellerStatusKey(sellerId, countryId, status),
      currentSkus,
      {
        ttl: -1,
      },
    );
  }

  private async updateProduct(
    sellerId: string,
    countryId: number,
    product: Product,
    initialStatus?: string,
  ) {
    if (initialStatus !== undefined && initialStatus !== product.status) {
      await this.deleteProductStatus(sellerId, countryId, initialStatus, product.sku);
    }
    if (initialStatus !== product.status) {
      await this.addSkuToProductStatus(sellerId, countryId, product.status, product.sku);
    }
    this.state = await this.getState();
    await this.state.put(
      ProductRepository.buildSellerSkuKey(sellerId, countryId, product.sku),
      product,
      {
        ttl: -1,
      },
    );
  }

  private async deleteProductStatus(
    sellerId: string,
    countryId: number,
    initialStatus: any,
    sku: string,
  ) {
    this.state = await this.getState();

    let currentSkus: string[] = [];
    await this.getSkusByType(sellerId, countryId, initialStatus).then(res => {
      currentSkus = res;
    });

    if (currentSkus.length > 0) {
      currentSkus.splice(currentSkus.indexOf(sku), 1);
      await this.state.put(
        ProductRepository.buildSellerStatusKey(sellerId, countryId, initialStatus),
        currentSkus,
        {
          ttl: -1,
        },
      );
    }
  }

  async deleteProduct(sellerId: string, countryId: number, sku: string) {
    this.state = await this.getState();

    const product = await this.getProduct(sellerId, countryId, sku);

    await this.deleteProductStatus(sellerId, countryId, product.status, sku);
    await this.state.delete(ProductRepository.buildSellerSkuKey(sellerId, countryId, sku));
  }
}
