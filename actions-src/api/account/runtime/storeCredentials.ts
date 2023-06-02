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

import Logger from '../../../shared/logger';
import { CredentialsRepository } from '../repository/credentialsRepository';
import { AccountRepository } from '../repository/accountRepository';
import Accounts = AmazonSalesChannel.Model.Accounts;
import { CredentialsEncryptionHelper } from '../../../shared/security/credentialsEncryptionHelper';
import EncryptionRequest = AdobeRuntime.EncryptionRequest;
import { InvalidDataError } from '../../../shared/runtime/invalidDataError';
import { NotFoundError } from '../../../shared/runtime/notFoundError';
import { errorResponse } from '../../../shared/utils';

interface StoreCredentialsRequest {
  accountId: string;
  refreshToken: string;
  sellingPartnerAppClientId: string;
  sellingPartnerAppClientSecret: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  awsSellingPartnerRole: string;
}

export interface StoreCredentialsResponse {
  encryptedCredentials: string;
  encryptedRefreshToken: string;
}

type Params = Readonly<AdobeRuntime.RequestParams> &
  Readonly<StoreCredentialsRequest> &
  Readonly<EncryptionRequest>;

const errorResponseHandler = errorResponse as AdobeRuntime.ErrorResponseHandler;

export async function main(params: Params): AdobeRuntime.Response<StoreCredentialsResponse> {
  const logger = new Logger(params.LOG_LEVEL);

  try {
    if (
      !params.accountId ||
      !params.refreshToken ||
      !params.sellingPartnerAppClientId ||
      !params.sellingPartnerAppClientSecret ||
      !params.awsAccessKeyId ||
      !params.awsSecretAccessKey ||
      !params.awsSellingPartnerRole
    ) {
      throw new InvalidDataError('Some required parameters were missing');
    }

    const accountRepository = new AccountRepository(logger);
    const accounts: Accounts = await accountRepository.getAccounts();

    if (accounts[params.accountId] === undefined) {
      throw new NotFoundError(`Account ${params.accountId} was not found`);
    }

    const credentialsRepository = new CredentialsRepository(logger);

    const credentialsEncryptionHelper = new CredentialsEncryptionHelper(
      params.ENCRYPTION_KEY,
      params.ENCRYPTION_IV,
    );
    const encryptedCredentials = credentialsEncryptionHelper.encryptCredentials({
      sellingPartnerAppClientId: params.sellingPartnerAppClientId,
      sellingPartnerAppClientSecret: params.sellingPartnerAppClientSecret,
      awsAccessKeyId: params.awsAccessKeyId,
      awsAccessKeySecret: params.awsSecretAccessKey,
      awsSellingPartnerRole: params.awsSellingPartnerRole,
    });

    await credentialsRepository.saveCredentials(
      accounts[params.accountId].id,
      encryptedCredentials,
    );

    const encryptedRefreshToken = credentialsEncryptionHelper.encrypt(params.refreshToken);

    await credentialsRepository.saveRefreshToken(
      accounts[params.accountId].id,
      encryptedRefreshToken,
    );

    return {
      statusCode: 200,
      body: {
        encryptedCredentials,
        encryptedRefreshToken,
      },
    };
  } catch (error: unknown) {
    let statusCode = 500;
    let message = error instanceof Error ? error.message : 'Server error';
    if (error instanceof InvalidDataError || error instanceof NotFoundError) {
      statusCode = error.getStatusCode();
      message = error.message;
    } else {
      logger.error('Cannot complete mapping of attribute', params, error);
    }
    return errorResponseHandler(statusCode, message, logger);
  }
}
