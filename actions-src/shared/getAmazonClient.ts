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

import { getAmazonClient as getClient } from '../amazon/amazonSpApi';
import { AmazonCredentialsFetcher } from './security/amazonCredentialsFetcher';
import Logger from './logger';
import GetCredentialsRequest = AmazonSalesChannel.Model.GetCredentialsRequest;

export async function getCredentials(
  accountId: string,
  encryptionKey: string,
  encryptionIv: string,
  logger: Logger,
) {
  const credentialsFetcher = new AmazonCredentialsFetcher(logger);
  const request: GetCredentialsRequest = {
    accountId,
    encryptionKey,
    encryptionIv,
  };
  return credentialsFetcher.fetchCredentials(request);
}

export async function getAmazonClient(
  accountId: string,
  encryptionKey: string,
  encryptionIv: string,
  logger: Logger,
) {
  const credentialsResponse = await getCredentials(accountId, encryptionKey, encryptionIv, logger);
  return getClient(credentialsResponse, logger);
}
