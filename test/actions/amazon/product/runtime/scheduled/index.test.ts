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

import axios from 'axios';
import { main as amazonProductSync } from '../../../../../../actions-src/amazon/product/runtime/scheduled/syncProducts';
import Accounts = AmazonSalesChannel.Model.Accounts;
import { AmazonCredentialsFetcher } from '../../../../../../actions-src/shared/security/amazonCredentialsFetcher';

const SellingPartnerAPI = require('amazon-sp-api');

// Mock jest and set the type
jest.mock('axios');
const mockedAxios = axios as jest.MockedFunction<typeof axios>;

const get = jest.fn();
const put = jest.fn();

jest.mock('@adobe/aio-lib-state', () => ({
  esModule: true,
  init: jest.fn().mockImplementation(() => ({
    get,
    put,
  })),
}));

jest.mock('amazon-sp-api');

const getAmazonClientMock = jest.fn();
const callAPIMock = jest.fn();
const downloadReportMock = jest.fn();

SellingPartnerAPI.mockImplementation(() => ({
  getAmazonClient: getAmazonClientMock,
  callAPI: callAPIMock,
  download: downloadReportMock,
}));

const DEFAULT_PARAMS = {
  LOG_LEVEL: 'info' as AdobeRuntime.LogLevel,
  ENCRYPTION_KEY: '',
  ENCRYPTION_IV: '',

};
const SECRET_PARAMS = {
  SP_API_CLIENT_ID: '',
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

function mockGetAmazonResponse(product: any): Promise<any> {
  return product;
}

describe('amazon sync products', () => {
  it("synchronizes product for a single store when product doesn't exist in db or commerce", async () => {
    get.mockReturnValueOnce(
      mockGetAccounts({
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
            listingSettings: {},
            orderSettings: {},
            integrationSettings: {},
            lifetimeSales: {},
            lastUpdatedAt: new Date(),
          },
        },
      ));

    callAPIMock.mockReturnValueOnce(
      mockGetAmazonResponse({
          'reports': [{
            'reportType': 'GET_MERCHANT_LISTINGS_ALL_DATA',
            'processingEndTime': '',
            'processingStatus': 'DONE',
            'marketplaceIds': ['ATVPDKIKX0DER'],
            'reportDocumentId': '1',
            'reportId': '1',
            'dataEndTime': '',
            'createdTime': '',
            'processingStartTime': '',
            'dataStartTime': '',
          },
          ],
          'nextToken': '1',
        },
      ));

    callAPIMock.mockReturnValueOnce(
      mockGetAmazonResponse({
          'reportDocumentId': '1',
          'url': '1',
        },
      ));

    downloadReportMock.mockReturnValueOnce(
      mockGetAmazonResponse([{
          'item-name': 'Item1',
          'seller-sku': 'SKU1',
          'price': '1',
          'quantity': '0',
          'asin1': '123',
          'status': 'INACTIVE',
        },
        ],
      ));

    callAPIMock.mockReturnValueOnce(
      mockGetAmazonResponse({
          'sku': 'SKU1',
          'summaries': [{
            'marketplaceId': 'ATVPDKIKX0DER',
            'asin': '123',
            'productType': 'default',
          }],
        },
      ));

    const mockFetchCredentials = jest.fn().mockResolvedValue({
      credentials: { accessKeyId: 'mockAccessKeyId', secretAccessKey: 'mockSecretAccessKey' },
      refreshToken: 'mockRefreshToken',
    });

    jest.spyOn(AmazonCredentialsFetcher.prototype, 'fetchCredentials').mockImplementation(mockFetchCredentials);


    mockedAxios.mockResolvedValueOnce({
      data: {
        'items': [],
      },
      status: 200,
      statusText: 'Ok',
      headers: {},
      config: {},
    });

    await amazonProductSync({
      ...DEFAULT_PARAMS,
      ...SECRET_PARAMS,
    });

    expect(get).toHaveBeenCalledTimes(3);
    expect(get).toHaveBeenCalledWith('accounts');
    expect(get).toHaveBeenCalledWith('ABC-1-SKU1');
    expect(get).toHaveBeenCalledWith('ABC-1-NEW_THIRD_PARTY');
    expect(callAPIMock).toHaveBeenCalledTimes(3);
  });
});
