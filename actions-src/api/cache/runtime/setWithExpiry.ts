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
import { CacheRepository } from '../repository/cacheRepository';
import Account = AmazonSalesChannel.Model.Account;

interface RequestParams {
  account: Account;
  key: string;
  value: any;
  ttl: number;
}

type Params = Readonly<AdobeRuntime.RequestParams> & Readonly<RequestParams>;

const errorResponseHandler = errorResponse as AdobeRuntime.ErrorResponseHandler;

export async function main(params: Params): AdobeRuntime.Response<any> {
  const logger = new Logger(params.LOG_LEVEL);
  const { account, key, value, ttl } = params;

  try {
    const cacheRepository = new CacheRepository(logger);

    logger.info('Set cache data ', { account, key });

    await cacheRepository.setWithExpiry(buildKey(account, key), value, ttl);

    logger.info('Finished setting cache data', { account, key });

    return {
      statusCode: 200,
      body: true,
    };
  } catch (error: unknown) {
    logger.error('Request to set cache data failed', { account, key }, error);
    return errorResponseHandler(500, 'Server error', logger);
  }
}

function buildKey(account: Account, key: string) {
  return `${account.id}_${key}`;
}
