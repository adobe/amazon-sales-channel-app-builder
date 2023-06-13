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
import { AttributeRepository } from '../../attribute/repository/attributeRepository';

type Params = Readonly<AdobeRuntime.RequestParams>;

export async function main(params: Params) {
  const logger = new Logger(params.LOG_LEVEL);
  const attributeRepository: AttributeRepository = new AttributeRepository(logger);

  try {
    const attributes = await attributeRepository.getAttributes();
    logger.info(`attributes: ${JSON.stringify(attributes)}`);
    return {
      statusCode: 200,
      body: attributes.filter(attribute => !!attribute.value).map(attribute => attribute.value),
    };
  } catch (error) {
    logger.error('Cannot get attributes', {}, error);
    return errorResponse(500, 'Internal server error', logger);
  }
}
