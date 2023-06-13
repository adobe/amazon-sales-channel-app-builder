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
import { getMerchantListingsReport } from '../../amazonSpApi';
import Logger from '../../../shared/logger';
import { getCredentials } from '../../../shared/getAmazonClient';
import { AccountRepository } from '../../../api/account/repository/accountRepository';
import EncryptionRequest = AdobeRuntime.EncryptionRequest;
import AccountRequest = AdobeRuntime.AccountRequest;

type Params = Readonly<AdobeRuntime.RequestParams> &
  Readonly<EncryptionRequest> &
  Readonly<AccountRequest>;

export async function main(params: Params) {
  const logger = new Logger(params.LOG_LEVEL);
  const GET_MERCHANT_LISTINGS_ALL_DATA = 'GET_MERCHANT_LISTINGS_ALL_DATA';

  try {
    const credentialsResponse = await getCredentials(
      params.account.id,
      params.ENCRYPTION_KEY,
      params.ENCRYPTION_IV,
      logger,
    );

    const accountRepository = new AccountRepository(logger);
    const country = await accountRepository.getCountryByAccountId(params.account.id);
    const marketplaceId: string = country.marketplaceId;

    const report = await getMerchantListingsReport(
      credentialsResponse,
      GET_MERCHANT_LISTINGS_ALL_DATA,
      marketplaceId,
      logger,
    );

    return {
      statusCode: 200,
      body: report,
    };
  } catch (error: unknown) {
    logger.error('Unexpected error while retrieving products', {}, error);
    return errorResponse(500, 'Cannot retrieve products', logger);
  }
}
