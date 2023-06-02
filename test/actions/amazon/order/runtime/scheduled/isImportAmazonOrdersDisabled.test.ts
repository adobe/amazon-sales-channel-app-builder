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
import {
  isImportAmazonOrdersEnabled,
} from '../../../../../../actions-src/amazon/order/runtime/scheduled/syncOrders';

describe('isImportAmazonOrdersDisabled', () => {
  it('should return true if accountData is undefined', () => {
    expect(isImportAmazonOrdersEnabled(undefined)).toBe(false);
  });

  it('should return true if id is undefined', () => {
    const accountData: Account = {} as Account;
    expect(isImportAmazonOrdersEnabled(accountData)).toBe(false);
  });

  it('should return true if enableImportAmazonOrders is 0', () => {
    const accountData: Account = {
      id: '1',
      storeName: 'Amazon',
      attributeId: '1',
      countryId: 1,
      sellerId: '1',
      emailAddress: 'a@a.com',
      productId: '1',
      websiteName: 'Amazon',
      websiteId: 1,
      createdAt: new Date(),
      status: 'active',
      listingSettings: { },
      orderSettings: {
        enableImportAmazonOrders: 0,
      },
      integrationSettings: { },
      lifetimeSales: { },
      lastUpdatedAt: new Date(),
    };

    expect(isImportAmazonOrdersEnabled(accountData)).toBe(false);
  });

  it('should return false if enableImportAmazonOrders is not 0', () => {
    const accountData: Account = {
      id: '1',
      storeName: 'Amazon',
      attributeId: '1',
      countryId: 1,
      sellerId: '1',
      emailAddress: 'a@a.com',
      productId: '1',
      websiteName: 'Amazon',
      websiteId: 1,
      createdAt: new Date(),
      status: 'active',
      listingSettings: { },
      orderSettings: {
        enableImportAmazonOrders: 1,
      },
      integrationSettings: { },
      lifetimeSales: { },
      lastUpdatedAt: new Date(),
    };

    expect(isImportAmazonOrdersEnabled(accountData)).toBe(true);
  });
});
