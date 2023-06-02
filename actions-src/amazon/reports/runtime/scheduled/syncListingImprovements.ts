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

import { getCredentials } from '../../../../shared/getAmazonClient';
import Logger from '../../../../shared/logger';
import { getMerchantListingsReport } from '../../../amazonSpApi';
import { AccountRepository } from '../../../../api/account/repository/accountRepository';
import { getCountryById } from '../../../../shared/localization/country';
import { ReportsRepository } from '../../../../api/reports/repository/reportsRepository';
import AmazonImpReport = AmazonSalesChannel.Model.AmazonImpReport;
import EncryptionRequest = AdobeRuntime.EncryptionRequest;

type Params = Readonly<AdobeRuntime.RequestParams> & Readonly<EncryptionRequest>;

export async function main(params: Params) {
  const logger = new Logger(params.LOG_LEVEL);
  const GET_MERCHANT_LISTING_IMP = 'GET_MERCHANTS_LISTINGS_FYP_REPORT';
  const accountRepository = new AccountRepository(logger);
  const accounts = await accountRepository.getAccounts();

  for (const [id, account] of Object.entries(accounts)) {
    try {
      const country = getCountryById(account.countryId);
      if (country !== undefined) {
        const marketplaceId: string = country.marketplaceId;
        logger.debug('Start getting listing improvements by account', account.id);
        const credentialsResponse = await getCredentials(
          account.id,
          params.ENCRYPTION_KEY,
          params.ENCRYPTION_IV,
          logger,
        );
        const batchReport = await getMerchantListingsReport(
          credentialsResponse,
          GET_MERCHANT_LISTING_IMP,
          marketplaceId,
          logger,
        );

        const reportsRepository = new ReportsRepository(logger);

        await reportsRepository.putListingImprovements(
          account.id,
          batchReport as Array<AmazonImpReport>,
        );
      }
    } catch (error) {
      logger.error('Cannot get listing improvements for account', { account }, error);
    }
  }
  logger.info('Finished retrieving Amazon listing improvements');

  return {
    statusCode: 200,
  };
}
