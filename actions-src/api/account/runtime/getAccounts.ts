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
import { AccountRepository } from '../repository/accountRepository';
import { errorResponse } from '../../../shared/utils';
import Accounts = AmazonSalesChannel.Model.Accounts;

const errorResponseHandler = errorResponse as AdobeRuntime.ErrorResponseHandler;

export interface GetAccountsResponse {
  accounts: Accounts;
}

type Params = Readonly<AdobeRuntime.RequestParams>;

export async function main(params: Params): AdobeRuntime.Response<GetAccountsResponse> {
  const logger = new Logger(params.LOG_LEVEL);

  try {
    const accountRepository: AccountRepository = new AccountRepository(logger);
    const accounts = await accountRepository.getAccounts();

    return {
      statusCode: 200,
      body: {
        accounts,
      },
    };
  } catch (error: unknown) {
    logger.error('Cannot get accounts', {}, error);

    const message = error instanceof Error ? error.message : 'Server error';
    return errorResponseHandler(500, message, logger);
  }
}
