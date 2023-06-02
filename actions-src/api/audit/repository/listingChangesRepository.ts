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

import { init, StateStore } from '@adobe/aio-lib-state';
import Logger from '../../../shared/logger';

import PageableRepository = AmazonSalesChannel.PageableRepository;
import ListingChange = AmazonSalesChannel.Model.ListingChange;
import ID = AmazonSalesChannel.ID;

const REPOSITORY_KEY = 'listingChanges';

export class ListingChangesRepository implements PageableRepository<ListingChange | null> {
  private state: StateStore | undefined;

  private readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  async getState() {
    if (!this.state) {
      this.state = await init();
    }
    return this.state;
  }

  private static buildErrorLogSellerId(sellerId: string, marketplaceId: string) {
    return `${REPOSITORY_KEY}-${sellerId}-${marketplaceId}`;
  }

  private static buildErrorLogId(id: string) {
    return `${REPOSITORY_KEY}-${id}`;
  }

  private async save(listingChange: ListingChange): Promise<ListingChange> {
    const state = await this.getState();
    await state.put(ListingChangesRepository.buildErrorLogId(listingChange.id), listingChange, {
      ttl: -1,
    });
    return listingChange;
  }

  async deleteListingChange(id: string, sellerId: string, marketplaceId: string): Promise<boolean> {
    const listingChanges = await this.getIds(sellerId, marketplaceId);
    try {
      const state = await this.getState();
      await state.delete(ListingChangesRepository.buildErrorLogId(id));
      await this.saveIds(
        sellerId,
        marketplaceId,
        listingChanges.filter(listingChangeId => id !== listingChangeId),
      );
    } catch {
      return false;
    }
    return true;
  }

  private async saveIds(
    sellerId: string,
    marketplaceId: string,
    communicationErrorLogs: Array<string>,
  ): Promise<Array<string>> {
    const state = await this.getState();
    await state.put(
      ListingChangesRepository.buildErrorLogSellerId(sellerId, marketplaceId),
      communicationErrorLogs,
      { ttl: -1 },
    );
    return communicationErrorLogs;
  }

  async saveListingChange(listingChange: ListingChange): Promise<ListingChange> {
    const { id, marketplaceId, sellerId } = listingChange;
    await this.save(listingChange);

    const existingCommunicationErrorLogs = await this.getIds(sellerId, marketplaceId);
    await this.saveIds(sellerId, marketplaceId, [...existingCommunicationErrorLogs, id]);
    return listingChange;
  }

  async getEntity(id: string): Promise<ListingChange | null> {
    const state = await this.getState();
    const res = await state.get(ListingChangesRepository.buildErrorLogId(id));

    return (res?.value as ListingChange) ?? null;
  }

  async getIds(sellerId: string, marketplaceId: string): Promise<Array<ID>> {
    const state = await this.getState();

    const res = await state.get(
      ListingChangesRepository.buildErrorLogSellerId(sellerId, marketplaceId),
    );
    return (res?.value as Array<string>) ?? [];
  }
}
