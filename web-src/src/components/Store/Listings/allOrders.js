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

import { Button, Divider, Flex, Heading, Text, View } from '@adobe/react-spectrum';
import Back from '@spectrum-icons/workflow/Back';
import { useNavigate, useLocation } from 'react-router-dom';
import { OrderListings } from './orderListings';
import { StoreInfo } from '../storeInfo';

export const AllOrders = props => {
  const location = useLocation();
  const navigate = useNavigate();
  const account = location.state.account;

  return (
    <View>
      <Divider size="S" marginTop={10} />
      <View backgroundColor="gray-100">
        <Flex direction="row" alignItems="center" justifyContent="space-between">
          <StoreInfo account={account} limitedInfo={false} />
          <View margin={10}>
            <Button variant={'primary'} onPress={() => navigate(-1)} isQuiet>
              <Back />
              <Text>Back</Text>
            </Button>
          </View>
        </Flex>
      </View>
      <Divider size="S" />
      <View margin={10}>
        <Heading level={3}>Amazon orders:</Heading>
        <Flex>
          <OrderListings
            runtime={props.runtime}
            ims={props.ims}
            createdAfter={account.createdAt}
            account={account}
          />
        </Flex>
      </View>
    </View>
  );
};
