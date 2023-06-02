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
import CommunicationErrorLog = AmazonSalesChannel.Model.CommunicationErrorLog;
import PageableRepository = AmazonSalesChannel.PageableRepository;
import ID = AmazonSalesChannel.ID;

const REPOSITORY_KEY = 'communicationErrorLogs';

export class CommunicationErrorLogRepository
  implements PageableRepository<CommunicationErrorLog | null>
{
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

  async getEntity(id: string): Promise<CommunicationErrorLog | null> {
    const state = await this.getState();
    const res = await state.get(CommunicationErrorLogRepository.buildErrorLogId(id));

    return (res?.value as CommunicationErrorLog) ?? null;
  }

  async getIds(sellerId: string, marketplaceId: string): Promise<Array<ID>> {
    const state = await this.getState();

    const res = await state.get(
      CommunicationErrorLogRepository.buildErrorLogSellerId(sellerId, marketplaceId),
    );
    return (res?.value as Array<string>) ?? [];
  }

  private async saveLog(
    communicationErrorLog: CommunicationErrorLog,
  ): Promise<CommunicationErrorLog> {
    const state = await this.getState();
    await state.put(
      CommunicationErrorLogRepository.buildErrorLogId(communicationErrorLog.id),
      communicationErrorLog,
      { ttl: -1 },
    );
    return communicationErrorLog;
  }

  async deleteLog(id: string, sellerId: string, marketplaceId: string): Promise<boolean> {
    const communicationErrorLogs = await this.getIds(sellerId, marketplaceId);
    try {
      const state = await this.getState();
      await state.delete(CommunicationErrorLogRepository.buildErrorLogId(id));
      await this.saveCommunicationErrorLogs(
        sellerId,
        marketplaceId,
        communicationErrorLogs.filter(logId => id !== logId),
      );
    } catch {
      return false;
    }
    return true;
  }

  private async saveIdsBySeller(
    id: string,
    sellerId: string,
    marketplaceId: string,
  ): Promise<Array<string>> {
    const existingCommunicationErrorLogs = await this.getIds(sellerId, marketplaceId);

    return this.saveCommunicationErrorLogs(sellerId, marketplaceId, [
      ...existingCommunicationErrorLogs,
      id,
    ]);
  }

  private async saveCommunicationErrorLogs(
    sellerId: string,
    marketplaceId: string,
    communicationErrorLog: Array<string>,
  ): Promise<Array<string>> {
    const state = await this.getState();
    await state.put(
      CommunicationErrorLogRepository.buildErrorLogSellerId(sellerId, marketplaceId),
      communicationErrorLog,
      { ttl: -1 },
    );
    return communicationErrorLog;
  }

  async saveCommunicationErrorLog(
    communicationErrorLog: CommunicationErrorLog,
  ): Promise<CommunicationErrorLog> {
    const { id, marketplaceId, sellerId } = communicationErrorLog;
    await this.saveLog(communicationErrorLog);
    await this.saveIdsBySeller(id, sellerId, marketplaceId);
    return communicationErrorLog;
  }
}
