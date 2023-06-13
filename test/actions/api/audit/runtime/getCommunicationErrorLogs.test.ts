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

import { main as getCommunicationErrorLogs } from '../../../../../actions-src/api/audit/runtime/getCommunicationErrorLogs';
import CommunicationErrorLog = AmazonSalesChannel.Model.CommunicationErrorLog;
import SuccessResponse = AdobeRuntime.SuccessResponse;
import Collection = AmazonSalesChannel.Collection;

const getIds = jest.fn();
const getEntity = jest.fn();

jest.mock('../../../../../actions-src/api/audit/repository/communicationErrorLogRepository', () => ({
    CommunicationErrorLogRepository: jest.fn().mockImplementation(() => ({ getIds, getEntity })),
  }));

const ERROR_LOG_ID = 'ID_123';
const SELLER_ID = 'SELLER_123';
const MARKETPLACE_ID = 'MARKETPLACE_123';

const communicationErrorLogToBeSave: CommunicationErrorLog = {
  id: ERROR_LOG_ID,
  marketplaceId: MARKETPLACE_ID,
  sellerId: SELLER_ID,
  code: 'CODE',
  createdAt: new Date(),
  message: 'MESSAGE',
  region: 'United States',
  storeName: 'Foo',
};

describe('getCommunicationErrorLogs', () => {

  beforeEach(() => {
    getIds.mockClear();
    getEntity.mockClear();
  });

  it('retrieves a list of error logs', async () => {
    getIds.mockReturnValue(Promise.resolve([
      ERROR_LOG_ID,
    ]));

    getEntity.mockReturnValue(Promise.resolve(communicationErrorLogToBeSave));

    const result = await getCommunicationErrorLogs({
      LOG_LEVEL: 'info',
      sellerId: SELLER_ID,
      marketplaceId: MARKETPLACE_ID,
    }) as SuccessResponse<Collection<CommunicationErrorLog>>;

    expect(result.statusCode).toBe(200);
    expect(result.body.collection).toStrictEqual([
      communicationErrorLogToBeSave,
    ]);
  });
});
