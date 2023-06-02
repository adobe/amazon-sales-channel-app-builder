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
  main as validateAccount,
  ValidateAccountResponse,
} from '../../../../../actions-src/api/account/runtime/validateAccount';
import { TestAccount } from '../entity/testAccount';
import Accounts = AmazonSalesChannel.Model.Accounts;

type SuccessResponse =  AdobeRuntime.SuccessResponse<ValidateAccountResponse>;

const get = jest.fn();
const read = jest.fn();

jest.mock('@adobe/aio-lib-state', () => ({
  esModule: true,
  init: jest.fn().mockImplementation(() => ({
    get,
  })),
}));

jest.mock('@adobe/aio-lib-files', () => ({
  esModule: true,
  init: jest.fn().mockImplementation(() => ({
    read,
  })),
}));

interface StateStoreResult<T> {
  value: T
}

function mockGetAccounts(accounts: Accounts): Promise<StateStoreResult<Accounts>> {
  return Promise.resolve({ value: accounts });
}

function mockReadCredentials(encryptedCredentials: string): Promise<string> {
  return Promise.resolve(encryptedCredentials);
}

function mockReadRefreshToken(encryptedRefreshToken: string): Promise<string> {
  return Promise.resolve(encryptedRefreshToken);
}

describe('api-validate-account', () => {
  it('Validate an account', async () => {
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

    read.mockResolvedValueOnce(mockReadCredentials('dc7fa4a2b28e14070c43d1102f0bc32ee2481d961349663a9a0ab4e8a675603bf009964dee4b5c89d0b3aff08fba5445521b1bdb648710aa74914beedd3b950741a9b83d45aa8c64feeb90ba698e8b1922a01539de1a34ec411c9907846a07cab53d20421249209ee2b8d0713adcc56fc76f2e16e3e8705f55d2348ca05e017ef7504a0fbad6bb72710684df52ac0e73f9bf7ac90101676355fe23e6a3daf1410ecd78b9899f1f58782df5bac0e346eec23b55c5d7b3c044585ebe19c831c8db6fbd4187bef9977bd2ba0e718b4ad06f13951f615bea6ab744f6dbab4c02deb141fa310cc6416b1fbe7f0e4046542f3246d8247940:06af92f834d6a0bf4298f51c7c9f6394'));
    read.mockResolvedValueOnce(mockReadRefreshToken('d538b1b5bb91153d0478d50c:29b32ae955f8c05c5c3a0ed182afde50'));

    const response =  await validateAccount({
      accountId,
      LOG_LEVEL: 'info',
      ENCRYPTION_KEY: 'encryptionKeyencryptionKey123456',
      ENCRYPTION_IV: 'encryptioniv',
    }) as SuccessResponse;

    expect(get).toHaveBeenCalledTimes(1);
    expect(read).toHaveBeenCalledTimes(2);
    expect(read).toHaveBeenCalledWith(`amazonsp-credentials-${accountId}`);
    expect(read).toHaveBeenCalledWith(`amazonsp-refreshToken-${accountId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      isValid: true,
    });
  });

  it('Try to validate an account using invalid credentials', async () => {
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

    read.mockResolvedValueOnce(mockReadCredentials('FAKEa4a2b28e14070c43d1102f0bc32ee2481d961349663a9a0ab4e8a675603bf009964dee4b5c89d0b3aff08fba5445521b1bdb648710aa74914beedd3b950741a9b83d45aa8c64feeb90ba698e8b1922a01539de1a34ec411c9907846a07cab53d20421249209ee2b8d0713adcc56fc76f2e16e3e8705f55d2348ca05e017ef7504a0fbad6bb72710684df52ac0e73f9bf7ac90101676355fe23e6a3daf1410ecd78b9899f1f58782df5bac0e346eec23b55c5d7b3c044585ebe19c831c8db6fbd4187bef9977bd2ba0e718b4ad06f13951f615bea6ab744f6dbab4c02deb141fa310cc6416b1fbe7f0e4046542f3246d8247940:06af92f834d6a0bf4298f51c7c9f6394'));
    read.mockResolvedValueOnce(mockReadRefreshToken('d538b1b5bb91153d0478d50c:29b32ae955f8c05c5c3a0ed182afde50'));

    const response =  await validateAccount({
      accountId,
      LOG_LEVEL: 'info',
      ENCRYPTION_KEY: 'encryptionKeyencryptionKey123456',
      ENCRYPTION_IV: 'encryptioniv',
    }) as SuccessResponse;

    expect(get).toHaveBeenCalledTimes(1);
    expect(read).toHaveBeenCalledTimes(1);
    expect(read).toHaveBeenCalledWith(`amazonsp-credentials-${accountId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      isValid: false,
    });
  });
});
