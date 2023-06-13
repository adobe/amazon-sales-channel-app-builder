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

import {
  CommunicationErrorLogRepository,
} from '../../../../../actions-src/api/audit/repository/communicationErrorLogRepository';
import Logger from '../../../../../actions-src/shared/logger';

import Mock = jest.Mock;
import CommunicationErrorLog = AmazonSalesChannel.Model.CommunicationErrorLog;

jest.mock('../../../../../actions-src/shared/logger');

const get = jest.fn();
const put = jest.fn();
const deleteFunc = jest.fn();

jest.mock('@adobe/aio-lib-state', () => ({
  esModule: true,
  init: jest.fn().mockImplementation(() => ({
    get,
    put,
    delete: deleteFunc,
  })),
}));

const communicationErrorLogRepository = new CommunicationErrorLogRepository(new Logger('info'));

const ERROR_LOG_ID = 'ID_123';
const KEY_ERROR_LOG_ID = `communicationErrorLogs-${ERROR_LOG_ID}`;
const MARKETPLACE_ID = 'MARKETPLACE_123';
const SELLER_ID = 'SELLER_123';
const KEY_SELLER_ID = `communicationErrorLogs-${SELLER_ID}-${MARKETPLACE_ID}`;

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

describe('CommunicationErrorLogRepository', () => {

  beforeEach(() => {
    (Logger as Mock).mockClear();
    get.mockClear();
    put.mockClear();
    deleteFunc.mockClear();
  });

  it('deleteLog removes a single log', async () => {
    get.mockReturnValue({
      value: [
        ERROR_LOG_ID,
      ],
    });
    const result = await communicationErrorLogRepository.deleteLog(ERROR_LOG_ID, SELLER_ID, MARKETPLACE_ID);
    expect(get).toHaveBeenCalledTimes(1);
    expect(deleteFunc).toHaveBeenCalledWith(KEY_ERROR_LOG_ID);
    expect(put).toHaveBeenCalledWith(KEY_SELLER_ID, [],       { ttl: -1 });
    expect(result).toBeTruthy();
  });

  it('deleteLog fails to remove a single log', async () => {
    get.mockReturnValue({
      value: [
        ERROR_LOG_ID,
      ],
    });

    deleteFunc.mockImplementationOnce(() => {
      throw new Error('Something');
    });

    const result = await communicationErrorLogRepository.deleteLog(ERROR_LOG_ID, SELLER_ID, MARKETPLACE_ID);
    expect(get).toHaveBeenCalled();
    expect(deleteFunc).toHaveBeenCalledWith(KEY_ERROR_LOG_ID);
    expect(put).not.toHaveBeenCalled();
    expect(result).toBeFalsy();
  });

  it('saveCommunicationErrorLog adds a single log file', async () => {
    get.mockReturnValue({
      value: [],
    });

    const result = await communicationErrorLogRepository.saveCommunicationErrorLog(communicationErrorLogToBeSave);
    expect(get).toHaveBeenCalled();
    expect(put).toHaveBeenCalledTimes(2);
    expect(put).toHaveBeenCalledWith(KEY_ERROR_LOG_ID, communicationErrorLogToBeSave, { ttl: -1 });
    expect(put).toHaveBeenCalledWith(KEY_SELLER_ID, [ERROR_LOG_ID], { ttl: -1 });
    expect(result).toStrictEqual(communicationErrorLogToBeSave);
  });

  it('getCommunicationErrorLogIds retrieves existing logs', async () => {
    get.mockReturnValue({
      value: [ERROR_LOG_ID],
    });

    const result = await communicationErrorLogRepository.getIds(SELLER_ID, MARKETPLACE_ID);
    expect(get).toHaveBeenCalled();
    expect(get).toHaveBeenCalledWith(KEY_SELLER_ID);
    expect(result).toStrictEqual([ERROR_LOG_ID]);
  });

  it('getCommunicationErrorLog retrieves existing log by ID', async () => {
    get.mockReturnValue({
      value: communicationErrorLogToBeSave,
    });

    const result = await communicationErrorLogRepository.getEntity(ERROR_LOG_ID);
    expect(get).toHaveBeenCalled();
    expect(get).toHaveBeenCalledWith(KEY_ERROR_LOG_ID);
    expect(result).toStrictEqual(communicationErrorLogToBeSave);
  });
});
