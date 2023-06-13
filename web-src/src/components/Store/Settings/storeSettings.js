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

import { Flex, Heading, Link, Text, View } from '@adobe/react-spectrum';

import { useNavigate } from 'react-router-dom';
import { IntegrationSettings } from './integrationSettings';

export const StoreSettings = props => {
  const navigate = useNavigate();

  function displayListingSettings() {
    return navigate('/amazon/account/listing_settings', {
      state: {
        account: props.account,
      },
    });
  }

  function displayLogs(accountId) {
    return navigate(`/amazon/account/${accountId}/logs`, {
      state: {
        account: props.account,
      },
    });
  }

  function displayStoreReports() {
    return navigate('/amazon/account/reports', {
      state: {
        account: props.account,
      },
    });
  }

  return (
    <Flex direction="column" gap="size-200">
      <Heading level={2}>Store Settings</Heading>
      <Flex direction="column">
        <Link isQuiet onPress={displayListingSettings}>
          Listing settings
        </Link>
        <Text>Control how your product catalog interacts with the Amazon marketplace</Text>
      </Flex>
      <Flex direction="column">
        <Link isQuiet onPress={displayStoreReports}>
          Store reports
        </Link>
        <Text>Competitive price analysis and listing improvements</Text>
      </Flex>
      <Flex direction="column">
        <Link isQuiet onPress={() => displayLogs(props.account.id)}>
          Logs
        </Link>
        <Text>Listing changes and communication errors</Text>
      </Flex>
      <Flex direction="column">
        <View marginEnd={10}>
          <IntegrationSettings account={props.account} runtime={props.runtime} ims={props.ims} />
        </View>
        <Text>Settings to connect Adobe Commerce catalog to your Amazon store</Text>
      </Flex>
    </Flex>
  );
};
