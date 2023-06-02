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

import { errorResponse } from '../../../shared/utils';
import Logger from '../../../shared/logger';
import { AccountRepository } from '../repository/accountRepository';
import Accounts = AmazonSalesChannel.Model.Accounts;
import Account = AmazonSalesChannel.Model.Account;

type Params = Readonly<AdobeRuntime.RequestParams> & Readonly<Account>;

const errorResponseHandler = errorResponse as AdobeRuntime.ErrorResponseHandler;

function validateAccount(params: Params): boolean {
  return typeof params?.id === 'string';
}

export async function main(params: Params): AdobeRuntime.Response<Accounts> {
  const logger = new Logger(params.LOG_LEVEL);

  const isValid = validateAccount(params);

  if (!isValid) {
    return errorResponseHandler(403, 'Validation failed: Amazon account ID is invalid', logger);
  }

  try {
    const accountRepository: AccountRepository = new AccountRepository(logger);
    const accounts: Accounts = await accountRepository.getAccounts();

    const {
      id,
      storeName,
      attributeId,
      countryId,
      sellerId,
      emailAddress,
      productId,
      websiteName,
      websiteId,
      createdAt,
      status,
      listingSettings,
      orderSettings,
      integrationSettings,
      lifetimeSales,
      lastUpdatedAt,
    } = params;

    accounts[id] = {
      id,
      storeName,
      attributeId,
      countryId,
      sellerId,
      emailAddress,
      productId,
      websiteName,
      websiteId,
      createdAt,
      status,
      listingSettings,
      orderSettings,
      integrationSettings,
      lifetimeSales,
      lastUpdatedAt,
    };

    await accountRepository.saveAccounts(accounts);

    return {
      statusCode: 200,
      body: accounts,
    };
  } catch (error: unknown) {
    logger.error('Failed to add Amazon account', {}, error);
    return errorResponseHandler(500, 'Server error', logger);
  }
}
