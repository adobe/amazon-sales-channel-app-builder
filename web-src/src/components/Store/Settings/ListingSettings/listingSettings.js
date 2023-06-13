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

import { useState } from 'react';
import {
  Button,
  Divider,
  Flex,
  Heading,
  Item,
  ProgressCircle,
  TabList,
  TabPanels,
  Tabs,
  Text,
  View,
} from '@adobe/react-spectrum';
import { useLocation, useNavigate } from 'react-router-dom';
import Back from '@spectrum-icons/workflow/Back';
import { StoreInfo } from '../../storeInfo';
import { ProductListingActions } from './productListingActions';
import { updateAccount } from '../../../../utils';
import { BusinessPrice } from './BusinessPrice';
import { ProductListingCondition } from './productListingCondition';

export const ListingSettings = props => {
  const navigate = useNavigate();
  const location = useLocation();
  const account = location.state.account;

  const [isLoading, setIsLoading] = useState(false);

  const saveListingSettings = async () => {
    setIsLoading(true);
    await updateAccount(props, account);
    setIsLoading(false);
    navigate(-1);
  };

  function ListingSettingsTabs() {
    const tabs = [
      {
        id: 1,
        name: 'Product Listing Actions',
        children: <ProductListingActions listingSettings={account.listingSettings} />,
      },
      {
        id: 2,
        name: '(B2B) Business Price',
        children: <BusinessPrice listingSettings={account.listingSettings} />,
      },
      {
        id: 3,
        name: 'Product Listing Condition',
        children: (
          <ProductListingCondition
            runtime={props.runtime}
            ims={props.ims}
            listingSettings={account.listingSettings}
          />
        ),
      },
    ];

    return (
      <>
        <Tabs aria-label="Listing Settings" items={tabs} orientation="vertical" isEmphasized={true}>
          <TabList>{item => <Item>{item.name}</Item>}</TabList>
          <TabPanels>{item => <Item>{item.children}</Item>}</TabPanels>
        </Tabs>
      </>
    );
  }

  return (
    <View margin={10}>
      <Heading level={2}>Product Listings</Heading>
      <Divider size="S" marginTop={10} />
      {isLoading ? (
        <Flex alignItems="center" justifyContent="center" height="100vh">
          <ProgressCircle size="L" aria-label="Loading…" isIndeterminate />
        </Flex>
      ) : (
        <View>
          <View backgroundColor="gray-200">
            <Flex direction="row" alignItems="center" justifyContent="space-between">
              <StoreInfo account={account} limitedInfo={true} />
              <View margin={10}>
                <Button variant={'primary'} onPress={() => navigate(-1)} isQuiet>
                  <Back />
                  <Text>Back</Text>
                </Button>
                <Button variant={'cta'} onPress={() => saveListingSettings()}>
                  <Text>Save listing settings</Text>
                </Button>
              </View>
            </Flex>
          </View>
          <View margin={10}>
            <Flex direction="column" justifyContent="space-between">
              <Flex justifyContent="right">
                <Button variant={'secondary'} onPress={() => viewUserGuide()}>
                  <Text>View User Guide</Text>
                </Button>
              </Flex>
              <ListingSettingsTabs />
            </Flex>
          </View>
        </View>
      )}
    </View>
  );
};

const viewUserGuide = () => {
  window.open(
    'https://experienceleague.adobe.com/docs/commerce-channels/amazon/listing-settings/listing-settings.html',
    '_blank',
  );
};
