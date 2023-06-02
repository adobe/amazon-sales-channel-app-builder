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

export default function useValidAccounts(props, accounts) {
  const [isValidatingAccounts, setValidatingAccounts] = useState(true);
  const [checkedAccounts, setCheckedAccounts] = useState({});

  useEffect(() => {
    const validateAccounts = async () => {
      for (const accountKey in accounts) {
        if (Object.hasOwn(accounts, accountKey)) {
          const account = accounts[accountKey];
          const accountId = account.id;
          const response = await callAction(props, 'api-validate-account', '', { accountId });
          setCheckedAccounts(checkedAccounts => ({
            ...checkedAccounts,
            [accountId]: response.isValid,
          }));
        }
      }
    };

    validateAccounts()
      .then(() => setValidatingAccounts(false))
      .catch(() => {});
  }, [accounts]);

  return { isValidatingAccounts, checkedAccounts };
}
