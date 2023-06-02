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

import SellingPartnerAPI from 'amazon-sp-api';
import { main as catalogProductSaveAfterListener } from '../../../../../../actions-src/commerce/product/runtime/listener/updateProduct';
import { AmazonCredentialsFetcher } from '../../../../../../actions-src/shared/security/amazonCredentialsFetcher';

import Accounts = AmazonSalesChannel.Model.Accounts;
import Mock = jest.Mock;

const get = jest.fn();
const put = jest.fn();
const read = jest.fn();

const getIds = jest.fn();
const getEntity = jest.fn();
const saveListingChanges = jest.fn();
jest.mock('../../../../actions-src/api/audit/repository/listingChangesRepository',
  () => ({
  ListingChangesRepository: jest.fn().mockImplementation(() => ({
    getIds,
    getEntity,
    saveListingChanges,
  })),
}));

jest.mock('@adobe/aio-lib-state', () => ({
  esModule: true,
  init: jest.fn().mockImplementation(() => ({
    get,
    put,
  })),
}));

jest.mock('@adobe/aio-lib-files', () => ({
  esModule: true,
  init: jest.fn().mockImplementation(() => ({
    read,
  })),
}));

jest.mock('../../../../actions-src/shared/security/amazonCredentialsFetcher');

jest.mock('amazon-sp-api');

const getAmazonClientMock = jest.fn();
const callAPIMock = jest.fn();

(SellingPartnerAPI as Mock).mockImplementation(() => ({
  getAmazonClient: getAmazonClientMock,
  callAPI: callAPIMock,
}));

const DEFAULT_PARAMS = {
  ENCRYPTION_KEY: 'key',
  ENCRYPTION_IV: 'iv',
  LOG_LEVEL: 'info' as AdobeRuntime.LogLevel,
  COMMERCE_BASE_URL: '',
  COMMERCE_CONSUMER_KEY: '',
  COMMERCE_CONSUMER_SECRET: '',
  COMMERCE_ACCESS_TOKEN: '',
  COMMERCE_ACCESS_TOKEN_SECRET: '',
};

interface Result<T> {
  value: T
}

function mockGetAccounts(accounts: Accounts): Promise<Result<Accounts>> {
  return Promise.resolve({
    value: accounts,
  });
}

function mockGetProduct(product: any): Promise<any> {
  return Promise.resolve({
    value: product,
  });
}

const defaultAccounts = {
  '123': {
    id: '123',
    storeName: 'defaultStore',
    attributeId: '',
    countryId: 1,
    sellerId: 'ABC',
    emailAddress: 'string',
    productId: 'string',
    websiteName: 'Default Store',
    websiteId: 1,
    createdAt: new Date(),
    status: '',
    listingSettings: {
      automaticListActionId: 1,
      listProductConditionId: 11,
    },
    orderSettings: {},
    integrationSettings: {},
    lifetimeSales: {},
    lastUpdatedAt: new Date(),
  },
  '125': {
    id: '125',
    storeName: 'secondStore',
    attributeId: '',
    countryId: 1,
    sellerId: 'XYZ',
    emailAddress: 'string',
    productId: 'string',
    websiteName: 'Second Store',
    websiteId: 2,
    createdAt: new Date(),
    status: '',
    listingSettings: {},
    orderSettings: {},
    integrationSettings: {},
    lifetimeSales: {},
    lastUpdatedAt: new Date(),
  },
};

describe('catalog-product-save-after-listener', () => {
  it('processes event when websiteId is 0, product is not in db nor in amazon and it meets listing rules', async () => {

    get.mockReturnValueOnce(mockGetAccounts(defaultAccounts));
    read.mockReturnValueOnce({
      credentials: {},
      refreshToken: {},
    });

    const mockFetchCredentials = jest.fn().mockResolvedValue({
      credentials: { accessKeyId: 'mockAccessKeyId', secretAccessKey: 'mockSecretAccessKey' },
      refreshToken: 'mockRefreshToken',
    });

    jest.spyOn(AmazonCredentialsFetcher.prototype, 'fetchCredentials').mockImplementation(mockFetchCredentials);

    const catalogAfterSaveEvent = {
      data: {
        value: {
          sku: 'SKU1',
          name: 'SKU1',
          asin: 'ASIN1',
          price: '0.9',
          amazon_condition: 'refurbished_refurbished',
          stock_data: {
            qty: '1',
          },
        },
        _metadata: {
          websiteId: '0',
        },
      },
    };

    const res = await catalogProductSaveAfterListener({
      ...DEFAULT_PARAMS,
      ...catalogAfterSaveEvent,
    });

    expect(get).toHaveBeenCalledTimes(5);
    expect(mockFetchCredentials).toHaveBeenCalledTimes(2);
    expect(get).toHaveBeenCalledWith('accounts');
    expect(get).toHaveBeenCalledWith('ABC-1-SKU1');
    expect(get).toHaveBeenCalledWith('ABC-1-SUBMITTED');
    expect(get).toHaveBeenCalledWith('XYZ-1-READY_TO_LIST');
    expect(callAPIMock).toHaveBeenCalledTimes(2);
    expect(saveListingChanges).not.toHaveBeenCalled();
  });

  it('processes event when websiteId is 1, meets listing rules, product is in amazon and db but does not have product type',
    async () => {

      get.mockReturnValueOnce(mockGetAccounts(defaultAccounts));
      get.mockReturnValueOnce(
        mockGetProduct(
          {
            id: '123',
            status: 'ACTIVE',
            price: 0.8,
            stock: 2,
            name: 'SKU1',
            asin: 'ASIN1',
            sku: 'SKU1',
            attributes: [],
          }));

      const catalogAfterSaveEvent = {
        data: {
          value: {
            sku: 'SKU1',
            name: 'SKU1',
            asin: 'ASIN1',
            price: '0.9',
            amazon_condition: '',
            stock_data: {
              qty: '1',
            },
          },
          _metadata: {
            websiteId: '1',
          },
        },
      };

      await  catalogProductSaveAfterListener({
        ...DEFAULT_PARAMS,
        ...catalogAfterSaveEvent,
      });

      expect(get).toHaveBeenCalledTimes(2);
      expect(get).toHaveBeenCalledWith('ABC-1-SKU1');
      expect(callAPIMock).toHaveBeenCalledTimes(2);
      expect(saveListingChanges).not.toHaveBeenCalled();
    });

  it('processes event when product meets listing rules but it is not in amazon', async () => {
    get.mockReturnValueOnce(mockGetAccounts(defaultAccounts));
    get.mockReturnValueOnce(
      mockGetProduct(
        {
          status: 'INCOMPLETE',
          price: 0.8,
          stock: 2,
          name: 'SKU1',
          asin: 'ASIN1',
          sku: 'SKU1',
          attributes: [],
        }));

    const catalogAfterSaveEvent = {
      data: {
        value: {
          sku: 'SKU1',
          name: 'SKU1',
          asin: 'ASIN1',
          price: '0.9',
          amazon_condition: '',
          stock_data: {
            qty: '1',
          },
        },
        _metadata: {
          websiteId: '1',
        },
      },
    };

    await catalogProductSaveAfterListener({
      ...DEFAULT_PARAMS,
      ...catalogAfterSaveEvent,
    });

    expect(get).toHaveBeenCalledTimes(3);
    expect(get).toHaveBeenCalledWith('ABC-1-SKU1');
    expect(callAPIMock).toHaveBeenCalledTimes(2);
    expect(saveListingChanges).not.toHaveBeenCalled();
  });
});
