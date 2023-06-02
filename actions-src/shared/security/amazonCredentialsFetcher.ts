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

import Logger from '../logger';
import { InvalidDataError } from '../runtime/invalidDataError';
import { AccountRepository } from '../../api/account/repository/accountRepository';
import { NotFoundError } from '../runtime/notFoundError';
import { CredentialsEncryptionHelper } from './credentialsEncryptionHelper';
import { CredentialsRepository } from '../../api/account/repository/credentialsRepository';
import GetCredentialsRequest = AmazonSalesChannel.Model.GetCredentialsRequest;
import Accounts = AmazonSalesChannel.Model.Accounts;
import Credentials = AmazonSalesChannel.Model.Credentials;
import GetCredentialsResponse = AmazonSalesChannel.Model.GetCredentialsResponse;

export class AmazonCredentialsFetcher {
  private readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  async fetchCredentials(request: GetCredentialsRequest): Promise<GetCredentialsResponse> {
    const account = await this.checkRequestData(request);

    const credentialsEncryptionHelper = new CredentialsEncryptionHelper(
      request.encryptionKey,
      request.encryptionIv,
    );
    const credentialsRepository = new CredentialsRepository(this.logger);

    const encryptedCredentials = await credentialsRepository.getCredentials(account.id);
    const credentials: Credentials =
      credentialsEncryptionHelper.decryptCredentials(encryptedCredentials);

    const encryptedRefreshToken = await credentialsRepository.getRefreshToken(account.id);
    const refreshToken = credentialsEncryptionHelper.decrypt(encryptedRefreshToken);

    return {
      credentials,
      refreshToken,
    } as GetCredentialsResponse;
  }

  private async checkRequestData(request: GetCredentialsRequest) {
    if (!request.accountId || !request.encryptionKey || !request.encryptionIv) {
      throw new InvalidDataError('Some required parameters were missing');
    }
    const accountRepository = new AccountRepository(this.logger);
    const accounts: Accounts = await accountRepository.getAccounts();

    if (accounts[request.accountId] === undefined) {
      throw new NotFoundError(`Account ${request.accountId} was not found}`);
    }
    return accounts[request.accountId];
  }
}
