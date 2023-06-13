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

import { Flex, View, Button, Divider } from '@adobe/react-spectrum';
import { StoreSettings } from './Settings/storeSettings';
import { StoreListings } from './Listings/storeListings';
import { StoreInfo } from './storeInfo';
import { useAccount } from '../../hooks/useAccounts';
import Loader from '../Shared/Loader';
import { useProducts } from '../../hooks/useProducts';

export const StoreView = props => {
  const { isLoading: isLoadingAccount, account } = useAccount(props);

  const { isLoadingProducts, products } = useProducts(props, account);

  const isLoading = isLoadingAccount || isLoadingProducts;
  return (
    <View>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Divider size="S" marginTop={10} />
          <View backgroundColor="gray-100">
            <Flex direction="row" alignItems="center" justifyContent="space-between">
              <StoreInfo account={account} limitedInfo={false} />
              <View margin={10}>
                <Button variant={'primary'} href="/" elementType="a">
                  Dashboard
                </Button>
              </View>
            </Flex>
          </View>
          <Divider size="S" />
          <View margin={10}>
            <Flex direction="row" gap="size-500">
              <View width="15%">
                <StoreSettings account={account} runtime={props.runtime} ims={props.ims} />
              </View>
              <View flex>
                <StoreListings
                  runtime={props.runtime}
                  ims={props.ims}
                  account={account}
                  products={products}
                />
              </View>
            </Flex>
          </View>
        </>
      )}
    </View>
  );
};
