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

import React, { useState } from 'react';
import {
  Button,
  ButtonGroup,
  Content,
  Dialog,
  DialogTrigger,
  Divider,
  Flex,
  Heading,
  Image,
  StatusLight,
  Text,
  View,
} from '@adobe/react-spectrum';
import '@spectrum-web-components/card/sp-card.js';
import { useNavigate } from 'react-router-dom';
import Delete from '@spectrum-icons/workflow/Delete';
import Alert from '@spectrum-icons/workflow/Alert';
import { FormattedMessage } from 'react-intl';
import { StoreViewLineChart } from '../../Amazon/storeViewLineChart';
import {
  callAction,
  getFormattedDate,
  getImageSrcPath,
  getStatusLightVariant,
} from '../../../utils';
import { useAmazonSales } from '../../../hooks/useAmazonSales';
import { getCurrencyLabel, getPercentageArrow } from './utils';
import { getCurrencyPercentage, getTotalAmount } from './amazonSalesUtils';
import useValidAccounts from '../../../hooks/useValidAccounts';
import Loader from '../../Shared/Loader';
import { useCountProductsByStatus } from '../../../hooks/useProducts';
import { useImsContext } from '../../../hooks/useImsContext';

const TIMEFRAME = 30;

function isLastUpdatedAtUndefined(account) {
  return !account.lastUpdatedAt;
}

function AccountCoverPhoto({ account }) {
  return (
    <div slot="cover-photo">
      <Flex direction="row" backgroundColor="gray-600" margin={20}>
        <View marginEnd={50}>
          <Image
            src={getImageSrcPath(account.countryId)}
            height="3.8rem"
            width="3.8rem"
            min-width="6.8rem"
            alt="Country image"
            UNSAFE_className="CountryFlag"
          />
        </View>
        <View>
          <Text>{account.storeName}</Text>
          <Flex direction="row" marginTop={15} UNSAFE_className="storeCardHeaderInfo">
            <Flex direction="column">
              <Text>Adobe Commerce Website</Text>
              <Text>Status</Text>
              <Text isHidden={isLastUpdatedAtUndefined(account)}>Last Updated</Text>
              <Text>Created</Text>
            </Flex>
            <Flex direction="column">
              <Text marginStart={15}>{account.websiteName}</Text>
              <Flex direction="row" alignItems="center">
                <StatusLight
                  size="s"
                  variant={getStatusLightVariant(account.status)}
                  position="absolute"
                  marginTop={20}
                >
                  <Text UNSAFE_className="storeCardHeaderInfo">{account.status}</Text>
                </StatusLight>
              </Flex>
              <Text isHidden={isLastUpdatedAtUndefined(account)} marginStart={15} marginTop={15}>
                {getFormattedDate(account.lastUpdatedAt)}
              </Text>
              <Text isHidden={isLastUpdatedAtUndefined(account)} marginStart={15}>
                {getFormattedDate(account.createdAt)}
              </Text>
              <Text isHidden={!isLastUpdatedAtUndefined(account)} marginStart={15} marginTop={15}>
                {getFormattedDate(account.createdAt)}
              </Text>
            </Flex>
          </Flex>
        </View>
      </Flex>
    </div>
  );
}

function AccountHeading({ incompleteProductsLength, account }) {
  const props = useImsContext();
  const { isLoadingAmazonSales, amazonSales } = useAmazonSales(props, account);
  return isLoadingAmazonSales ? (
    <Loader />
  ) : (
    <>
      <div slot="heading">
        <Flex direction="column">
          <Text>Gross Market Volume (30 day)</Text>
          <Flex direction="row" marginTop={10}>
            <Text>
              {getCurrencyLabel(account.countryId)}
              {getTotalAmount(amazonSales)}
            </Text>
            <Flex direction="row" marginStart={20}>
              {getPercentageArrow(getCurrencyPercentage(amazonSales, TIMEFRAME))}
              <Text>{getCurrencyPercentage(amazonSales, TIMEFRAME)}%</Text>
            </Flex>
          </Flex>
          <StoreViewLineChart amazonSales={amazonSales} />
        </Flex>
      </div>
      <div slot="subheading">
        <Text>
          <Alert color="negative" size="XXS" /> Incomplete Listings: {incompleteProductsLength}
        </Text>
      </div>
    </>
  );
}

function AccountFooter({ isValidAccount, account, deleteAccount }) {
  const navigate = useNavigate();

  function displayStore(id) {
    return navigate(`/amazon/account/${id}`, {
      state: {
        account,
      },
    });
  }

  return (
    <div slot="footer">
      <Button
        variant={'primary'}
        isDisabled={!isValidAccount}
        onPress={() => displayStore(account.id)}
        margin={10}
      >
        <Text>
          <FormattedMessage id="app.view-store" defaultMessage="View Store" />
        </Text>
      </Button>
      <DialogTrigger>
        <Button variant={'primary'} isQuiet margin={10}>
          <Delete />
          <Text>Delete</Text>
        </Button>
        {close => (
          <Dialog>
            <Heading>Delete account</Heading>
            <Divider />
            <Content>Are you sure you want to delete this account?</Content>
            <ButtonGroup>
              <Button variant="secondary" onPress={close} marginEnd={10}>
                Cancel
              </Button>
              <Button
                variant="secondary"
                onPress={() => deleteAccount(account.id, close)}
                marginEnd={10}
              >
                Confirm
              </Button>
            </ButtonGroup>
          </Dialog>
        )}
      </DialogTrigger>
    </div>
  );
}

function DisplayAccount({ isValidAccount, account, incompleteProductsCount, deleteAccount }) {
  return (
    <div className="storeCard">
      <sp-card style={{ '--spectrum-card-body-header-height': 'auto' }}>
        <AccountCoverPhoto account={account} />
        <AccountHeading incompleteProductsLength={incompleteProductsCount} account={account} />
        <AccountFooter
          isValidAccount={isValidAccount}
          account={account}
          deleteAccount={deleteAccount}
        />
      </sp-card>
    </div>
  );
}

function DisplayAccounts({ accounts, incompleteProducts, deleteAccount, checkedAccounts }) {
  return (
    <>
      {accounts.map(account => (
        <DisplayAccount
          key={account.id}
          isValidAccount={checkedAccounts[account.id]}
          account={account}
          incompleteProductsCount={incompleteProducts[account.id]}
          deleteAccount={deleteAccount}
        />
      ))}
    </>
  );
}

export function AccountsListing(props) {
  const accounts = props.accounts;
  const { checkedAccounts } = useValidAccounts(props, props.accounts);

  const [isLoading, setIsLoading] = useState(false);

  const { isLoadingProducts, products: incompleteProducts } = useCountProductsByStatus(
    props,
    props.accounts,
    'incomplete',
  );

  async function deleteAccount(accountId, close) {
    setIsLoading(true);
    await callAction(props, 'api-delete-account', '', { accountId });
    close();
    window.location.reload();
  }

  const weAreLoading = isLoading || isLoadingProducts;

  return (
    <View>
      {weAreLoading ? (
        <Loader />
      ) : (
        <Flex direction="row" gap="size-200" wrap marginBottom={50}>
          <DisplayAccounts
            accounts={accounts}
            incompleteProducts={incompleteProducts}
            deleteAccount={deleteAccount}
            checkedAccounts={checkedAccounts}
          />
        </Flex>
      )}
    </View>
  );
}
