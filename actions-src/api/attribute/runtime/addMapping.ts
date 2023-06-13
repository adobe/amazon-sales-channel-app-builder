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

import AttributeMap = AmazonSalesChannel.Model.AttributeMap;
import Logger from '../../../shared/logger';
import { errorResponse } from '../../../shared/utils';
import { InvalidDataError } from '../../../shared/runtime/invalidDataError';
import { AttributeRepository } from '../repository/attributeRepository';
import { NotFoundError } from '../../../shared/runtime/notFoundError';

interface AttributeMapRequest {
  marketplaceId: string;
  amazonAttributeName: string;
  productCatalogAttributeCode: string;
  status: boolean;
}

type Params = Readonly<AdobeRuntime.RequestParams> & Readonly<AttributeMapRequest>;

const errorResponseHandler = errorResponse as AdobeRuntime.ErrorResponseHandler;

export async function main(params: Params): AdobeRuntime.Response<AttributeMap> {
  const logger = new Logger(params.LOG_LEVEL);

  try {
    if (!params.marketplaceId || !params.amazonAttributeName) {
      throw new InvalidDataError('Not enough params given');
    }

    const attributeRepository = new AttributeRepository(logger);
    const attribute = await attributeRepository.getAttribute(
      params.marketplaceId,
      params.amazonAttributeName,
    );

    if (!attribute) {
      throw new NotFoundError(
        `Attribute ${params.amazonAttributeName} was expected to be present in DB but was not found`,
      );
    }

    attribute.productCatalogAttributeCode = params.productCatalogAttributeCode;
    attribute.status = params.status;

    await attributeRepository.saveAttribute(attribute);

    return {
      statusCode: 200,
      body: attribute,
    };
  } catch (error: unknown) {
    let statusCode = 500;
    let message = 'Server error';
    if (error instanceof InvalidDataError || error instanceof NotFoundError) {
      statusCode = error.getStatusCode();
      message = error.message;
    } else {
      logger.error('Cannot complete mapping of attribute', params, error);
    }
    return errorResponseHandler(statusCode, message, logger);
  }
}
