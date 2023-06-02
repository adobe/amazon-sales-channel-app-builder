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
import { useLocation, useParams } from 'react-router-dom';
import { callAction } from '../utils';
import Account = AmazonSalesChannel.Model.Account;
import Accounts = AmazonSalesChannel.Model.Accounts;
import IMSContextProps = AmazonSalesChannel.IMSContextProps;

async function getAccounts(props): Promise<Accounts> {
  return (await callAction(props, 'api-get-accounts', '')) as Accounts;
}

interface UseAccountsReturn {
  isLoadingAccounts: boolean;
  accounts: Array<Account>;
}

export const useAccounts = (props): UseAccountsReturn => {
  const [accounts, setAccounts] = useState<Array<Account>>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);

  const fetchAccounts = async () => {
    const response = await getAccounts(props);
    setAccounts(Object.values(response.accounts));
  };

  useEffect(() => {
    fetchAccounts()
      .then(() => setIsLoadingAccounts(false))
      .catch(() => {});
  }, []);

  return { isLoadingAccounts, accounts };
};

interface UseAccountState {
  account: Account | null;
  isLoading: boolean;
}

export const useAccount = (props: IMSContextProps): UseAccountState => {
  const location = useLocation();
  const locationAccount: Account = (location?.state?.account as Account) ?? null;
  const { accountId } = useParams<'accountId'>() as { accountId: string };

  const [state, setState] = useState<UseAccountState>({
    account: locationAccount,
    isLoading: !locationAccount,
  });

  const fetchAccounts = async (id: string) => {
    const response = await getAccounts(props);
    setState({
      ...state,
      account: response.accounts[id],
      isLoading: false,
    });
  };

  useEffect(() => {
    fetchAccounts(state.account?.id ?? accountId).catch(console.error);
  }, [state.account?.id ?? accountId]);

  return state;
};
