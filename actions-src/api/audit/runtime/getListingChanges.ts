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
import { pageable } from '../../../shared/pagination';
import { ListingChangesRepository } from '../repository/listingChangesRepository';
import Collection = AmazonSalesChannel.Collection;
import Account = AmazonSalesChannel.Model.Account;
import ListingChange = AmazonSalesChannel.Model.ListingChange;

interface RequestParams {
  sellerId: Account['sellerId'];
  marketplaceId: string;
  currentPage?: number;
}

type Params = Readonly<AdobeRuntime.RequestParams & RequestParams>;

const errorResponseHandler = errorResponse as AdobeRuntime.ErrorResponseHandler;

export async function main(params: Params): AdobeRuntime.Response<Collection<ListingChange>> {
  const logger = new Logger(params.LOG_LEVEL);
  const { sellerId, marketplaceId, currentPage } = params;

  try {
    logger.info('Get listing changes', {
      sellerId,
    });

    const listingChangesRepository = new ListingChangesRepository(logger);
    const ids = await listingChangesRepository.getIds(sellerId, marketplaceId);
    const pageableData = await pageable(
      ids,
      listingChangesRepository,
      {
        defaultPage: 1,
        itemsPerPage: 300,
      },
      currentPage,
    );

    const collection: Array<ListingChange> = pageableData.collection.filter(
      change => !!change,
    ) as Array<ListingChange>;

    logger.info('Listing changes found', {
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
    logger.error('Request to get listing changes failed', { sellerId, marketplaceId }, error);
    return errorResponseHandler(500, 'Server error', logger);
  }
}
