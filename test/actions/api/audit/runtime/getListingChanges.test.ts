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

import { main as getListingChanges } from '../../../../../actions-src/api/audit/runtime/getListingChanges';

import SuccessResponse = AdobeRuntime.SuccessResponse;
import Collection = AmazonSalesChannel.Collection;
import ListingChange = AmazonSalesChannel.Model.ListingChange;

const getIds = jest.fn();
const getEntity = jest.fn();

jest.mock('../../../../../actions-src/api/audit/repository/listingChangesRepository', () => ({
    ListingChangesRepository: jest.fn().mockImplementation(() => ({ getIds, getEntity })),
  }));

const LISTING_CHANGE_ID = 'ID_123';
const SELLER_ID = 'SELLER_123';
const MARKETPLACE_ID = 'MARKETPLACE_123';

const listingChangeToBeSaved: ListingChange = {
  id: LISTING_CHANGE_ID,
  sellerId: SELLER_ID,
  marketplaceId: MARKETPLACE_ID,
  sellerSku: 'SKU',
  comments: 'COMMENT',
  createdAt: new Date(),
  listingAction: 'LISTING_ACTION',
  region: 'United States',
  storeName: 'Foo',
};

describe('getListingChanges', () => {

  beforeEach(() => {
    getIds.mockClear();
    getEntity.mockClear();
  });

  it('retrieves a list of listing changes', async () => {
    getIds.mockReturnValue(Promise.resolve([
      LISTING_CHANGE_ID,
    ]));

    getEntity.mockReturnValue(Promise.resolve(listingChangeToBeSaved));

    const result = await getListingChanges({
      LOG_LEVEL: 'info',
      sellerId: SELLER_ID,
      marketplaceId: MARKETPLACE_ID,
    }) as SuccessResponse<Collection<ListingChange>>;

    expect(result.statusCode).toBe(200);
    expect(result.body.collection).toStrictEqual([
      listingChangeToBeSaved,
    ]);
  });
});
