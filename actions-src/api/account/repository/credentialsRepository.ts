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

import Account = AmazonSalesChannel.Model.Account;
import { LibFilesRepository } from '../../../shared/repository/libFilesRepository';

export class CredentialsRepository extends LibFilesRepository {
  async saveCredentials(accountId: Account['id'], credentials: string) {
    this.files = await this.getFiles();

    await this.files.write(`amazonsp-credentials-${accountId}`, credentials);
  }

  async getCredentials(accountId: Account['id']): Promise<string> {
    this.files = await this.getFiles();

    const buffer = await this.files.read(`amazonsp-credentials-${accountId}`);
    return buffer.toString();
  }

  async saveRefreshToken(accountId: Account['id'], refreshToken: string) {
    this.files = await this.getFiles();

    await this.files.write(`amazonsp-refreshToken-${accountId}`, refreshToken);
  }

  async getRefreshToken(accountId: Account['id']): Promise<string> {
    this.files = await this.getFiles();

    const buffer = await this.files.read(`amazonsp-refreshToken-${accountId}`);
    return buffer.toString();
  }
}
