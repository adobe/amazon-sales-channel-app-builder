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

import { LibStateRepository } from '../../../shared/repository/libStateRepository';
import { getCountryById } from '../../../shared/localization/country';
import { NotFoundError } from '../../../shared/runtime/notFoundError';
import Accounts = AmazonSalesChannel.Model.Accounts;
import Account = AmazonSalesChannel.Model.Account;

export class AccountRepository extends LibStateRepository {
  async getAccounts(): Promise<Accounts> {
    this.state = await this.getState();

    const res = await this.state.get('accounts');
    return res?.value ?? [];
  }

  async getAccount(accountId: string): Promise<Account> {
    const accounts = await this.getAccounts();

    if (accounts[accountId] === undefined) {
      throw new NotFoundError(`Account ${accountId} was not found}`);
    }

    return accounts[accountId];
  }

  async getCountryByAccountId(accountId: string) {
    const account = await this.getAccount(accountId);
    const country = getCountryById(account.countryId);

    if (country === undefined) {
      throw new NotFoundError(`Country ${account.countryId} was not found`);
    }

    return country;
  }

  async deleteAccount(accountId: string) {
    this.state = await this.getState();
    const accounts = await this.getAccounts();

    const accountsToKeep: Record<string, Account> = {};
    const parsedAccounts = JSON.parse(JSON.stringify(accounts));

    let isDeleted = false;
    for (const parsedAccountId in parsedAccounts) {
      if (parsedAccountId === accountId) {
        isDeleted = true;
      } else {
        accountsToKeep[parsedAccountId] = parsedAccounts[parsedAccountId];
      }
    }

    if (isDeleted) {
      await this.state.put('accounts', accountsToKeep, { ttl: -1 });
    }

    return isDeleted;
  }

  async saveAccounts(accounts: Accounts) {
    this.state = await this.getState();
    await this.state.put('accounts', accounts, { ttl: -1 });
  }
}
