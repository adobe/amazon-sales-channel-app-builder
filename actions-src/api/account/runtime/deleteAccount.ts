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
import { errorResponse } from '../../../shared/utils';
import { AccountRepository } from '../repository/accountRepository';
import { InvalidDataError } from '../../../shared/runtime/invalidDataError';
import { NotFoundError } from '../../../shared/runtime/notFoundError';

const errorResponseHandler = errorResponse as AdobeRuntime.ErrorResponseHandler;

interface DeleteAccountRequest {
  accountId: string;
}

export interface DeleteAccountResponse {
  isDeleted: string;
}

type Params = Readonly<AdobeRuntime.RequestParams> & Readonly<DeleteAccountRequest>;

export async function main(params: Params): AdobeRuntime.Response<DeleteAccountResponse> {
  const logger = new Logger(params.LOG_LEVEL);

  try {
    const accountRepository: AccountRepository = new AccountRepository(logger);
    const isDeleted = await accountRepository.deleteAccount(params.accountId);

    if (!isDeleted) {
      throw new NotFoundError(`Account ${params.accountId} was not deleted`);
    }

    return {
      statusCode: 200,
      body: {
        isDeleted: isDeleted ? 'true' : 'false',
      },
    };
  } catch (error: unknown) {
    let statusCode = 500;
    let message = error instanceof Error ? error.message : 'Server error';
    if (error instanceof InvalidDataError || error instanceof NotFoundError) {
      statusCode = error.getStatusCode();
      message = error.message;
    } else {
      logger.error('Cannot delete an account', params, error);
    }
    return errorResponseHandler(statusCode, message, logger);
  }
}
