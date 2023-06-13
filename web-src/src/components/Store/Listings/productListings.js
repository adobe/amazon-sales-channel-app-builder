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

import React, { useMemo } from 'react';
import {
  Button,
  Divider,
  Flex,
  Heading,
  Item,
  TabList,
  Tabs,
  Text,
  View,
} from '@adobe/react-spectrum';
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import Back from '@spectrum-icons/workflow/Back';
import { StoreInfo } from '../storeInfo';
import { useAccount } from '../../../hooks/useAccounts';

import Loader from '../../Shared/Loader';
import {
  ActiveListings,
  InactiveListings,
  IncompleteListings,
  NewThirdPartyListings,
  ReadyListings,
} from './ProductListings/Tables';
import { useProducts } from '../../../hooks/useProducts';

const defaultTab = 'incomplete';

function buildBasePath(accountId) {
  return `/amazon/account/${accountId}`;
}

function TabLabel({ label, count }) {
  return <>{`${label} - ${count ?? 0}`}</>;
}

function ProductTabPanels({ isLoading, products }) {
  const { type } = useParams();
  switch (type) {
    case 'incomplete': {
      return <IncompleteListings isLoading={isLoading} products={products.incomplete} />;
    }
    case 'new_third_party': {
      return <NewThirdPartyListings isLoading={isLoading} products={products.newThirdParty} />;
    }
    case 'inactive': {
      return <InactiveListings isLoading={isLoading} products={products.inactive} />;
    }
    case 'active': {
      return <ActiveListings isLoading={isLoading} products={products.active} />;
    }
    case 'ready_to_list': {
      return <ReadyListings isLoading={isLoading} products={products.readyToList} />;
    }
    default: {
      return <></>;
    }
  }
}

function ProductsTabs({ account, counts }) {
  const { type } = useParams();

  const navigate = useNavigate();
  const tabs = useMemo(
    () => [
      {
        id: 'incomplete',
        name: 'Incomplete',
        count: counts.incomplete,
      },
      {
        id: 'new_third_party',
        name: 'New Third Party',
        count: counts.newThirdParty,
      },
      {
        id: 'ready_to_list',
        name: 'Ready To List',
        count: counts.readyToList,
        isHidden: account.listingSettings.automaticListActionId === 1,
      },
      {
        id: 'inactive',
        name: 'Inactive',
        count: counts.inactive,
      },
      {
        id: 'active',
        name: 'Active',
        count: counts.active,
      },
    ],
    [counts],
  );

  const defaultSelectedKey = type || defaultTab;
  const basePath = buildBasePath(account?.id);

  return (
    <>
      <Tabs
        aria-label="Product Listings"
        items={tabs.filter(tab => !tab.isHidden)}
        orientation="horizontal"
        isEmphasized={true}
        defaultSelectedKey={defaultSelectedKey}
        onSelectionChange={tabId => {
          navigate(`${basePath}/listings/${tabId}`, {
            replace: false,
          });
        }}
      >
        <TabList>
          {item => (
            <Item textValue={`${item.name} - (${item.count})`}>
              <TabLabel label={item.name} count={item.count} />
            </Item>
          )}
        </TabList>
        <Outlet />
      </Tabs>
    </>
  );
}

function getCounts(products) {
  return {
    incomplete: products.incomplete.length,
    active: products.active.length,
    inactive: products.inactive.length,
    newThirdParty: products.newThirdParty.length,
    readyToList: products.readyToList.length,
  };
}

export const ProductListings = props => {
  const location = useLocation();
  const navigate = useNavigate();

  const { accountId } = useParams();
  const { isLoading: isLoadingAccount, account } = useAccount(props, {
    account: location?.state?.account,
    accountId,
  });

  const basePath = buildBasePath(account?.id);

  const { isLoadingProducts, products } = useProducts(props, account);
  const counts = getCounts(products);

  return (
    <View margin={10}>
      <Heading level={2}>Product Listings</Heading>
      <Divider size="S" marginTop={10} />
      {isLoadingAccount || isLoadingProducts ? (
        <Loader />
      ) : (
        <>
          <View backgroundColor="gray-200">
            <Flex direction="row" alignItems="center" justifyContent="space-between">
              <StoreInfo account={account} limitedInfo={true} />
              <View margin={10}>
                <Button variant={'primary'} onPress={() => navigate(basePath)} isQuiet>
                  <Back />
                  <Text>Back</Text>
                </Button>
              </View>
            </Flex>
          </View>
          <View margin={10}>
            <Routes location={location}>
              <Route element={<ProductsTabs account={account} counts={counts} />}>
                <Route
                  index
                  element={<Navigate replace to={`${basePath}/listings/${defaultTab}`} />}
                />
                <Route
                  index
                  path=":type"
                  element={<ProductTabPanels isLoading={isLoadingProducts} products={products} />}
                />
              </Route>
            </Routes>
          </View>
        </>
      )}
    </View>
  );
};
