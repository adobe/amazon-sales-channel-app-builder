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
import { getCompetitivePrices } from '../../amazonSpApi';
import Logger from '../../../shared/logger';
import { getAmazonClient } from '../../../shared/getAmazonClient';
import { AccountRepository } from '../../../api/account/repository/accountRepository';
import EncryptionRequest = AdobeRuntime.EncryptionRequest;
import Account = AmazonSalesChannel.Model.Account;

interface CompetitivePricingRequest {
  account: Account;
  skus: string[];
}

type Params = Readonly<AdobeRuntime.RequestParams> &
  Readonly<EncryptionRequest> &
  Readonly<CompetitivePricingRequest>;

export async function main(params: Params) {
  const logger = new Logger(params.LOG_LEVEL);

  if (params.skus.length === 0) {
    logger.error('there are not skus');
    return;
  }

  try {
    const amazonClient = await getAmazonClient(
      params.account.id,
      params.ENCRYPTION_KEY,
      params.ENCRYPTION_IV,
      logger,
    );

    const accountRepository = new AccountRepository(logger);
    const country = await accountRepository.getCountryByAccountId(params.account.id);
    const marketplaceId: string = country.marketplaceId;

    const competitivePricing = await getCompetitivePrices(amazonClient, marketplaceId, params.skus);

    return {
      statusCode: 200,
      body: competitivePricing,
    };
  } catch (error: unknown) {
    logger.error('Failed to get competitive prices', {}, error);
    return errorResponse(500, 'Failed to get competitive prices', logger);
  }
}
