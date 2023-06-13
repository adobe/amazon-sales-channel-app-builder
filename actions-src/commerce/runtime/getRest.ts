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

import { errorResponse, checkMissingRequestInputs } from '../../shared/utils';
import { getCommerceOauthClient } from '../oauth1a';
import Logger from '../../shared/logger';

type Params = Readonly<AdobeRuntime.RequestParamsWithHeaders & Commerce.Model.RequestParams>;

export async function main(params: Params): AdobeRuntime.Response<unknown> {
  const {
    COMMERCE_BASE_URL,
    COMMERCE_ACCESS_TOKEN,
    COMMERCE_ACCESS_TOKEN_SECRET,
    COMMERCE_CONSUMER_KEY,
    COMMERCE_CONSUMER_SECRET,
    LOG_LEVEL,
    operation,
  } = params;
  const logger = new Logger(LOG_LEVEL);

  try {
    const requiredParams = ['operation', 'COMMERCE_BASE_URL'];
    const requiredHeaders = ['Authorization'];
    const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders);
    if (errorMessage) {
      return errorResponse(400, errorMessage, logger);
    }

    const oauth = getCommerceOauthClient(
      {
        url: COMMERCE_BASE_URL,
        consumerKey: COMMERCE_CONSUMER_KEY,
        consumerSecret: COMMERCE_CONSUMER_SECRET,
        accessToken: COMMERCE_ACCESS_TOKEN,
        accessTokenSecret: COMMERCE_ACCESS_TOKEN_SECRET,
      },
      logger,
    );

    const content = await oauth.get(operation);
    return {
      statusCode: 200,
      body: content,
    };
  } catch {
    logger.error('Unable to get commerce response', { COMMERCE_BASE_URL, operation });
    return errorResponse(500, 'Unable to get commerce response', logger);
  }
}
