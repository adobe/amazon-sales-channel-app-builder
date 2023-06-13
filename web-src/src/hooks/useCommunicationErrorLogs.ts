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

import { useEffect, useState } from 'react';
import { callAction } from '../utils';
import Collection = AmazonSalesChannel.Collection;
import CommunicationErrorLog = AmazonSalesChannel.Model.CommunicationErrorLog;
import IMSContextProps = AmazonSalesChannel.IMSContextProps;
import Account = AmazonSalesChannel.Model.Account;
import { getCountryById, getCountryByName } from '../../../actions-src/shared/localization/country';

interface UseCommunicationErrorLogsState {
  data: Collection<CommunicationErrorLog>;
  isLoading: boolean;
}

async function getCommunicationErrorLogs(
  props: IMSContextProps & { sellerId: string; marketplaceId: string },
): Promise<Collection<CommunicationErrorLog>> {
  const { marketplaceId, sellerId } = props;
  return (await callAction(props, 'api-get-communication-error-logs', '', {
    marketplaceId,
    sellerId,
  })) as Collection<CommunicationErrorLog>;
}

export const useCommunicationErrorLogs = (
  props: IMSContextProps,
  account: Account | null,
): UseCommunicationErrorLogsState => {
  const [state, setState] = useState<UseCommunicationErrorLogsState>({
    data: {
      collection: [],
      total: 0,
      count: 0,
      pagination: {
        lastPage: 1,
        currentPage: 1,
      },
    },
    isLoading: !account,
  });

  const fetchCommunicationErrorLogs = async (sellerId: string, marketplaceId: string) => {
    const response = await getCommunicationErrorLogs({
      ...props,
      sellerId,
      marketplaceId,
    });

    setState({
      ...state,
      data: response,
      isLoading: false,
    });
  };

  useEffect(() => {
    if (account) {
      const marketplaceId = getCountryById(account.countryId)?.marketplaceId;
      if (account.sellerId && marketplaceId) {
        fetchCommunicationErrorLogs(account.sellerId, marketplaceId).catch(console.error);
      }
    }
  }, [account?.sellerId, account?.countryId]);

  return state;
};
