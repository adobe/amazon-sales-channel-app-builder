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
import { CredentialsEncryptionHelper } from '../../../shared/security/credentialsEncryptionHelper';
import { InvalidDataError } from '../../../shared/runtime/invalidDataError';
import { NotFoundError } from '../../../shared/runtime/notFoundError';
import { errorResponse } from '../../../shared/utils';
import EncryptionRequest = AdobeRuntime.EncryptionRequest;
import Credentials = AmazonSalesChannel.Model.Credentials;

interface ValidateAccountRequest {
  accountId: string;
}

export interface ValidateAccountResponse {
  isValid: boolean;
}

type Params = Readonly<AdobeRuntime.RequestParams> &
  Readonly<ValidateAccountRequest> &
  Readonly<EncryptionRequest>;

const errorResponseHandler = errorResponse as AdobeRuntime.ErrorResponseHandler;

export async function main(params: Params): AdobeRuntime.Response<ValidateAccountResponse> {
  const logger = new Logger(params.LOG_LEVEL);

  try {
    if (!params.accountId || !params.ENCRYPTION_KEY || !params.ENCRYPTION_IV) {
      throw new InvalidDataError('Some required parameters were missing');
    }

    const accountRepository = new AccountRepository(logger);
    const account = await accountRepository.getAccount(params.accountId);

    let isValid: boolean;
    try {
      const credentialsEncryptionHelper = new CredentialsEncryptionHelper(
        params.ENCRYPTION_KEY,
        params.ENCRYPTION_IV,
      );
      const credentialsRepository = new CredentialsRepository(logger);

      const encryptedCredentials = await credentialsRepository.getCredentials(account.id);
      const credentials: Credentials =
        credentialsEncryptionHelper.decryptCredentials(encryptedCredentials);

      const encryptedRefreshToken = await credentialsRepository.getRefreshToken(account.id);
      const refreshToken = credentialsEncryptionHelper.decrypt(encryptedRefreshToken);

      isValid = !!(refreshToken && credentials);
    } catch {
      isValid = false;
    }

    return {
      statusCode: 200,
      body: {
        isValid,
      },
    };
  } catch (error: unknown) {
    let statusCode = 500;
    let message = error instanceof Error ? error.message : 'Server error';
    if (error instanceof InvalidDataError || error instanceof NotFoundError) {
      statusCode = error.getStatusCode();
      message = error.message;
    } else {
      logger.error('Cannot validate account', params, error);
    }
    return errorResponseHandler(statusCode, message, logger);
  }
}
