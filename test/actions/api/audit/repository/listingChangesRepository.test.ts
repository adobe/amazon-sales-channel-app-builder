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

import { ListingChangesRepository } from '../../../../../actions-src/api/audit/repository/listingChangesRepository';
import Logger from '../../../../../actions-src/shared/logger';

import Mock = jest.Mock;
import ListingChange = AmazonSalesChannel.Model.ListingChange;

jest.mock('../../../../../actions-src/shared/logger');

const get = jest.fn();
const put = jest.fn();
const deleteFunc = jest.fn();

jest.mock('@adobe/aio-lib-state', () => ({
  esModule: true,
  init: jest.fn().mockImplementation(() => ({
    get,
    put,
    delete: deleteFunc,
  })),
}));

const listingChangesRepository = new ListingChangesRepository(new Logger('info'));

const LISTING_CHANGE_ID = 'ID_123';
const KEY_LISTING_CHANGE_ID = `listingChanges-${LISTING_CHANGE_ID}`;
const SELLER_ID = 'SELLER_123';
const MARKETPLACE_ID = 'MARKETPLACE_123';
const KEY_COLLECTION_ID = `listingChanges-${SELLER_ID}-${MARKETPLACE_ID}`;

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

describe('ListingChangesRepository', () => {

  beforeEach(() => {
    (Logger as Mock).mockClear();
    get.mockClear();
    put.mockClear();
    deleteFunc.mockClear();
  });

  it('deleteListingChange removes a single listing change', async () => {
    get.mockReturnValue({
      value: [
        LISTING_CHANGE_ID,
      ],
    });
    const result = await listingChangesRepository.deleteListingChange(LISTING_CHANGE_ID, SELLER_ID, MARKETPLACE_ID);
    expect(get).toHaveBeenCalledTimes(1);
    expect(deleteFunc).toHaveBeenCalledWith(KEY_LISTING_CHANGE_ID);
    expect(put).toHaveBeenCalledWith(KEY_COLLECTION_ID, [], { ttl: -1 });
    expect(result).toBeTruthy();
  });

  it('deleteListingChange fails to remove a single listing change', async () => {
    get.mockReturnValue({
      value: [
        LISTING_CHANGE_ID,
      ],
    });

    deleteFunc.mockImplementationOnce(() => {
      throw new Error('Something');
    });

    const result = await listingChangesRepository.deleteListingChange(LISTING_CHANGE_ID, SELLER_ID, MARKETPLACE_ID);
    expect(get).toHaveBeenCalled();
    expect(deleteFunc).toHaveBeenCalledWith(KEY_LISTING_CHANGE_ID);
    expect(put).not.toHaveBeenCalled();
    expect(result).toBeFalsy();
  });

  it('saveListingChange adds a single listing change', async () => {
    get.mockReturnValue({
      value: [],
    });

    const result = await listingChangesRepository.saveListingChange(listingChangeToBeSaved);
    expect(get).toHaveBeenCalled();
    expect(put).toHaveBeenCalledTimes(2);
    expect(put).toHaveBeenCalledWith(KEY_LISTING_CHANGE_ID, listingChangeToBeSaved, { ttl: -1 });
    expect(put).toHaveBeenCalledWith(KEY_COLLECTION_ID, [LISTING_CHANGE_ID], { ttl: -1 });
    expect(result).toStrictEqual(listingChangeToBeSaved);
  });

  it('getIds retrieves existing listingChanges', async () => {
    get.mockReturnValue({
      value: [LISTING_CHANGE_ID],
    });

    const result = await listingChangesRepository.getIds(SELLER_ID, MARKETPLACE_ID);
    expect(get).toHaveBeenCalled();
    expect(get).toHaveBeenCalledWith(KEY_COLLECTION_ID);
    expect(result).toStrictEqual([LISTING_CHANGE_ID]);
  });

  it('getEntity retrieves existing listingChange by ID', async () => {
    get.mockReturnValue({
      value: listingChangeToBeSaved,
    });

    const result = await listingChangesRepository.getEntity(LISTING_CHANGE_ID);
    expect(get).toHaveBeenCalled();
    expect(get).toHaveBeenCalledWith(KEY_LISTING_CHANGE_ID);
    expect(result).toStrictEqual(listingChangeToBeSaved);
  });
});
