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

import { ComboBox, Flex, Heading, Item, Link, Text, View } from '@adobe/react-spectrum';
import { useNavigate } from 'react-router-dom';
import { SellerCentralLinks } from '../sellerCentralLinks';
import { StoreViewLineChart } from '../../Amazon/storeViewLineChart';
import { useAmazonSales } from '../../../hooks/useAmazonSales';
import { getCurrencyLabel, getPercentageArrow } from './utils';
import { calculateLifetimeSales, getCurrencyPercentage, getTotalAmount } from './amazonSalesUtils';
import { OrderListings } from './orderListings';

export const StoreListings = props => {
  const navigate = useNavigate();
  const { amazonSales } = useAmazonSales(props, props.account);
  const TIMEFRAME = 30;

  function displayProductListings(selectedTab = '') {
    return navigate(`/amazon/account/${props.account.id}/listings/${selectedTab}`);
  }

  function getAllOrdersPath() {
    return `/amazon/account/${props.account.id}/orders`;
  }

  function displayAllOrders() {
    return navigate(getAllOrdersPath(), {
      state: {
        account: props.account,
      },
    });
  }

  return (
    <View>
      <Flex direction="column">
        <Flex direction="row" gap="size-300">
          <View flex>
            <Flex direction="row" alignItems="center" justifyContent="space-between">
              <View>
                <Heading level={2}>Store Listings</Heading>
              </View>
              <View>
                <Link isQuiet onPress={() => displayProductListings()}>
                  Manage Listings
                </Link>
              </View>
            </Flex>
            <Flex
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              margin={10}
              marginStart={100}
              marginEnd={100}
            >
              <Flex direction="column" alignItems="center" marginTop={10}>
                <Heading level={3}>
                  {getCurrencyLabel(props.account.countryId)}
                  {calculateLifetimeSales(amazonSales, props)}
                </Heading>
                <Text>Lifetime Sales</Text>
              </Flex>
              <Flex direction="column" alignItems="center" marginTop={10}>
                <Heading level={3}>{props.products.active.length}</Heading>
                <Link isQuiet onPress={() => displayProductListings('active')}>
                  Active Listings
                </Link>
              </Flex>
              <Flex direction="column" alignItems="center" marginTop={10}>
                <Heading level={3}>{props.products.inactive.length}</Heading>
                <Link isQuiet onPress={() => displayProductListings('inactive')}>
                  Inactive Listings
                </Link>
              </Flex>
              <Flex direction="column" alignItems="center" marginTop={10}>
                <Heading level={3}>{props.products.incomplete.length}</Heading>
                <Link isQuiet onPress={() => displayProductListings('incomplete')}>
                  In Progress Listings
                </Link>
              </Flex>
            </Flex>
            <View marginTop={20}>
              <Flex direction="column" alignContent="center" justifyContent="space-evenly">
                <Heading level={4}>Amazon Store Sales Revenue</Heading>
                <Flex direction="row" alignItems="center" justifyContent="space-between">
                  <View>
                    <ComboBox
                      isQuiet
                      justifySelf="auto"
                      selectedKey="last30"
                      width="size-1600"
                      maxWidth="100%"
                    >
                      <Item key="last30">Last 30 days</Item>
                    </ComboBox>
                  </View>
                  <View>
                    <Text>
                      {getCurrencyLabel(props.account.countryId)}
                      {getTotalAmount(amazonSales)}
                    </Text>
                    <Text marginStart={20}>
                      {getPercentageArrow(getCurrencyPercentage(amazonSales, TIMEFRAME))}
                      {getCurrencyPercentage(amazonSales, TIMEFRAME)}%
                    </Text>
                  </View>
                </Flex>
              </Flex>
            </View>
            <Flex direction="column" marginTop={20}>
              <StoreViewLineChart amazonSales={amazonSales} />
            </Flex>
          </View>
          <View width="25%" backgroundColor="gray-200">
            <SellerCentralLinks />
          </View>
        </Flex>
        <View>
          <Flex direction="row" alignItems="center">
            <Heading level={3}>Recent orders:</Heading>
            <Link isQuiet marginStart={10} onPress={() => displayAllOrders()}>
              All Orders
            </Link>
          </Flex>
          <OrderListings
            runtime={props.runtime}
            ims={props.ims}
            createdAfter={props.account.createdAt}
            account={props.account}
          />
        </View>
      </Flex>
    </View>
  );
};
