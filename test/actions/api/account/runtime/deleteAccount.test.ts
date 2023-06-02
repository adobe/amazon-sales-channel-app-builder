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

import {
  main as deleteAccount,
  DeleteAccountResponse,
} from '../../../../../actions-src/api/account/runtime/deleteAccount';
import { TestAccount } from '../entity/testAccount';
import Accounts = AmazonSalesChannel.Model.Accounts;
import ErrorResponse = AdobeRuntime.ErrorResponse;

type SuccessResponse =  AdobeRuntime.SuccessResponse<DeleteAccountResponse>;

const get = jest.fn();
const put = jest.fn();

jest.mock('@adobe/aio-lib-state', () => ({
  esModule: true,
  init: jest.fn().mockImplementation(() => ({
    get,
    put,
  })),
}));

interface StateStoreResult<T> {
  value: T
}

function mockGetAccounts(accounts: Accounts): Promise<StateStoreResult<Accounts>> {
  return Promise.resolve({ value: accounts });
}

function mockPutAccounts(accounts: Accounts): Promise<string> {
  return Promise.resolve('ok');
}

describe('api-delete-account', () => {
  it('Delete an exising account', async () => {
    const account = new TestAccount(
      'attribute',
      1,
      'test@test.com',
      '1',
      'ASDASDDSA',
      'active',
      'a new store',
      1,
      'Main Website',
    );

    const accountId = account.id;
    const accounts: Accounts = {};
    accounts[accountId] = account;
    get.mockReturnValueOnce(mockGetAccounts(accounts));

    put.mockResolvedValueOnce(mockPutAccounts(accounts));

    const response =  await deleteAccount({
      accountId,
      LOG_LEVEL: 'info',
    }) as SuccessResponse;

    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith('accounts');
    expect(put).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      isDeleted: 'true',
    });
  });

  it('Cannot delete an account', async () => {
    const account = new TestAccount(
      'attribute',
      1,
      'test@test.com',
      '1',
      'ASDASDDSA',
      'active',
      'a new store',
      1,
      'Main Website',
    );

    const accounts: Accounts = {};
    accounts[account.id] = account;
    get.mockReturnValueOnce(mockGetAccounts(accounts));

    const response =  await deleteAccount({
      accountId: 'missingId',
      LOG_LEVEL: 'info',
    }) as ErrorResponse;

    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith('accounts');
    expect(put).toHaveBeenCalledTimes(0);
    expect(response.error.statusCode).toBe(404);
  });
});
