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
import { CommunicationErrorLogRepository } from '../repository/communicationErrorLogRepository';
import { pageable } from '../../../shared/pagination';
import Collection = AmazonSalesChannel.Collection;
import Account = AmazonSalesChannel.Model.Account;
import CommunicationErrorLog = AmazonSalesChannel.Model.CommunicationErrorLog;

interface RequestParams {
  sellerId: Account['sellerId'];
  marketplaceId: string;
  currentPage?: number;
}

type Params = Readonly<AdobeRuntime.RequestParams & RequestParams>;

const errorResponseHandler = errorResponse as AdobeRuntime.ErrorResponseHandler;

export async function main(
  params: Params,
): AdobeRuntime.Response<Collection<CommunicationErrorLog>> {
  const logger = new Logger(params.LOG_LEVEL);
  const { marketplaceId, sellerId, currentPage } = params;

  try {
    logger.info('Get communication error logs', {
      sellerId,
    });

    const communicationErrorLogRepository = new CommunicationErrorLogRepository(logger);
    const ids = await communicationErrorLogRepository.getIds(sellerId, marketplaceId);
    const pageableData = await pageable(
      ids,
      communicationErrorLogRepository,
      {
        defaultPage: 1,
        itemsPerPage: 300,
      },
      currentPage,
    );

    const collection: Array<CommunicationErrorLog> = pageableData.collection.filter(
      log => !!log,
    ) as Array<CommunicationErrorLog>;

    logger.info('Communication error logs found', {
      sellerId,
      collection,
      total: pageableData.total,
      currentPage: pageableData.pagination.currentPage,
    });

    return {
      statusCode: 200,
      body: {
        ...pageableData,
        collection,
      },
    };
  } catch (error: unknown) {
    logger.error('Request to get communication logs failed', { sellerId, marketplaceId }, error);
    return errorResponseHandler(500, 'Server error', logger);
  }
}
