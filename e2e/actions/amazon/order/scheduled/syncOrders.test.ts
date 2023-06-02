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

import { Core } from '@adobe/aio-sdk';
import stateLib from '@adobe/aio-lib-state';
import { getAmazonClient } from '../../../../../actions-src/amazon/amazonSpApi';
import { getCommerceOauthClient } from '../../../../../actions-src/commerce/oauth1a';
import { main } from '../../../../../actions-src/amazon/order/runtime/scheduled/syncOrders';
import Mock = jest.Mock;

const mockLoggerInstance = { info: jest.fn(), debug: jest.fn(), error: jest.fn() };
Core.Logger.mockReturnValue(mockLoggerInstance);

jest.mock('@adobe/aio-sdk', () => ({
  Core: {
    Logger: jest.fn(),
  },
}));

jest.mock('@adobe/aio-lib-state');
jest.mock('@adobe/aio-sdk');

jest.mock('../../../../../actions-src/amazon/amazonSpApi', () => ({
  getAmazonClient: jest.fn(),
  }));
jest.mock('../../../../../actions-src/commerce/oauth1a', () => ({
  getCommerceOauthClient: jest.fn(),
}));

beforeEach(() => {
  Core.Logger.mockClear();
  mockLoggerInstance.info.mockReset();
  mockLoggerInstance.debug.mockReset();
  mockLoggerInstance.error.mockReset();
});

// TODO: Fix these tests
describe.skip('sync orders main action', () => {
  let params = {};
  beforeEach(() => {
    params = {
      COMMERCE_BASE_URL: 'https://commerce.com',
      COMMERCE_CONSUMER_KEY: 'key',
      COMMERCE_CONSUMER_SECRET: 'secret',
      COMMERCE_ACCESS_TOKEN: 'token',
      COMMERCE_ACCESS_TOKEN_SECRET: 'token_secret',
    };

    (stateLib.init as Mock).mockResolvedValue({
      get: jest.fn().mockResolvedValue({ value: { account1: { id: 'account1' } } }),
    });

    (getAmazonClient as Mock).mockResolvedValue({
      callAPI: jest.fn().mockResolvedValue({
        Orders: [
          {
            AmazonOrderId: '1',
            ShippingAddress: {
              StateOrRegion: 'California',
              StateOrProvinceCode: 'CA',
              CountryCode: 'US',
              AddressLine1: 'New Street',
              PostalCode: '90230',
              City: 'Los Angeles',
              Phone: '666666666',
            },
            BuyerInfo: {
              BuyerName: 'John Smith',
              BuyerEmail: 'john.smith@example.com',
            },
          },
        ],
        OrderItems: [{ SellerSKU: 'sku', QuantityOrdered: 1 }],
      }),
    });

    (getCommerceOauthClient as Mock).mockReturnValue({
      post: jest.fn().mockResolvedValue({
        text: jest.fn().mockResolvedValue('"guest-cart-id"'),
        json: jest.fn().mockResolvedValue(1),
      }),
    });
  });

  it('should sync orders and return success and failure details when orderSettings of account are default', async () => {
    const result = await main(params as any);
    expect(result).toEqual({
      statusCode: 200,
      body: {
        successSyncs: [{ accountId: 'account1', orders: [1] }],
        failedSyncs: [],
      },
    });
  });

  it('should not sync orders if enableImportOrders of account is disabled', async () => {
    (stateLib.init as Mock).mockResolvedValue({
      get: jest.fn().mockResolvedValue({
        value: {
          account1: {
            id: 'account1',
            orderSettings: { enableImportAmazonOrders: 0 },
          },
        },
      }),
    });

    const result = await main(params as any);
    expect(result).toEqual({
      statusCode: 200,
      body: {
        successSyncs: [],
        failedSyncs: [],
      },
    });
  });

  it('should return error if there is an error syncing orders because of a api call', async () => {
    (getAmazonClient as Mock).mockRejectedValue(new Error('API call failed'));
    const result = await main(params as any);
    expect(result).toEqual({
      statusCode: 200,
      body: {
        successSyncs: [],
        failedSyncs: [{ accountId: 'account1', error: 'API call failed' }],
      },
    });
  });
});
