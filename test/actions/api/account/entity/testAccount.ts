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

import { randomUUID } from 'node:crypto';
import Account = AmazonSalesChannel.Model.Account;

export class TestAccount implements Account {
  attributeId: string;

  countryId: number;

  createdAt: Date = new Date();

  emailAddress: string;

  id: AmazonSalesChannel.ID = randomUUID();

  integrationSettings: {} = {};

  lastUpdatedAt: Date = new Date();

  lifetimeSales: {} = {};

  listingSettings: {} = {};

  orderSettings: {} = {};

  productId: string;

  sellerId: string;

  status: string;

  storeName: string;

  websiteId: number;

  websiteName: string;

  constructor(attributeId: string, countryId: number, emailAddress: string, productId: string, sellerId: string, status: string, storeName: string, websiteId: number, websiteName: string) {
    this.attributeId = attributeId;
    this.countryId = countryId;
    this.emailAddress = emailAddress;
    this.productId = productId;
    this.sellerId = sellerId;
    this.status = status;
    this.storeName = storeName;
    this.websiteId = websiteId;
    this.websiteName = websiteName;
  }
}
