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
import AmazonImpReport = AmazonSalesChannel.Model.AmazonImpReport;
import Logger from '../../../shared/logger';
import { ReportsRepository } from '../repository/reportsRepository';

interface RequestParams {
  accountId: string;
}

type Params = Readonly<AdobeRuntime.RequestParams> & Readonly<RequestParams>;

const errorResponseHandler = errorResponse as AdobeRuntime.ErrorResponseHandler;

export async function main(params: Params): AdobeRuntime.Response<Array<AmazonImpReport>> {
  const logger = new Logger(params.LOG_LEVEL);
  const { accountId } = params;
  const reportsRepository = new ReportsRepository(logger);

  try {
    const listingImprovements = await reportsRepository.getListingImprovements(accountId);

    return {
      statusCode: 200,
      body: listingImprovements.length === 0 ? [] : listingImprovements,
    };
  } catch (error) {
    logger.error('Request to get listing improvements failed for account', { accountId }, error);
    return errorResponseHandler(500, 'Server error', logger);
  }
}
