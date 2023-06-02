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

import { Divider, Flex, Heading, Image, Text, View } from '@adobe/react-spectrum';
import { FormattedMessage } from 'react-intl';
import { useEffect, useState } from 'react';
import { AccountsAddForm } from './AddAccountForm';
import { getAmazonLogoSrcPath } from '../../utils';
import { useAccounts } from '../../hooks/useAccounts';
import Loader from '../Shared/Loader';
import { SalesChannelTabs } from './salesChannelTabs';

export const SalesChannel = props => {
  const { isLoadingAccounts, accounts } = useAccounts(props);
  const [selectedTab, setSelectedTab] = useState(1);

  useEffect(() => {
    if (isLoadingAccounts === false && accounts.length === 0) {
      setSelectedTab(2);
    } else {
      setSelectedTab(1);
    }
  }, [isLoadingAccounts]);

  const onSelectionTabChange = selectedTabKey => {
    setSelectedTab(selectedTabKey);
  };

  return (
    <View>
      {isLoadingAccounts ? (
        <Loader />
      ) : (
        <Flex direction="column" gap="size-100">
          <Divider size="S" marginTop={10} />
          <Flex
            direction="row"
            marginStart={10}
            marginEnd={10}
            alignItems="center"
            justifyContent="space-between"
          >
            <Flex direction="row" alignItems="center">
              <View marginEnd={20} marginStart={20}>
                <Image
                  src={getAmazonLogoSrcPath()}
                  height="2.8rem"
                  width="2.8rem"
                  min-width="5.8rem"
                  alt="Amazon logo"
                  UNSAFE_className="AmazonLogo"
                />
              </View>
              <View marginEnd={10}>
                <Flex direction="column">
                  <Heading level={2} margin={0}>
                    <FormattedMessage
                      id="app.sell-products"
                      defaultMessage="Sell products in the Amazon marketplace"
                    />
                  </Heading>
                  <Text>
                    Synchronize product and order data between your Adobe Commerce and Amazon
                    accounts.
                  </Text>
                </Flex>
              </View>
            </Flex>
            <Flex>
              <View marginEnd={10}>
                <AccountsAddForm />
              </View>
            </Flex>
          </Flex>
          <Divider size="S" />
          <View>
            <SalesChannelTabs
              tab={selectedTab}
              onSelectionTabChange={onSelectionTabChange}
              accounts={accounts}
              runtime={props.runtime}
              ims={props.ims}
            />
          </View>
        </Flex>
      )}
    </View>
  );
};
