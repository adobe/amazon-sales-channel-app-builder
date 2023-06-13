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

import {
  View,
  Divider,
  Heading,
  Flex,
  Button,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Item,
} from '@adobe/react-spectrum';
import { FormattedMessage } from 'react-intl';
import Back from '@spectrum-icons/workflow/Back';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { StoreInfo } from '../../storeInfo';
import { communicationErrorsLogColumns, listingChangesLogColumns } from './columns';
import { GenericTabWithTableView } from '../../Listings/ProductListings/Tables';
import { useAccount } from '../../../../hooks/useAccounts';
import { useImsContext } from '../../../../hooks/useImsContext';
import { useCommunicationErrorLogs } from '../../../../hooks/useCommunicationErrorLogs';
import Loader from '../../../Shared/Loader';
import { useListingChanges } from '../../../../hooks/useListingChanges';

import Account = AmazonSalesChannel.Model.Account;
import IMSContextProps = AmazonSalesChannel.IMSContextProps;

interface Tab {
  id: number;
  name: JSX.Element;
  children: JSX.Element;
  textValue: string;
}

interface CommunicationErrorLogsTableProps {
  ims: IMSContextProps;
  account: Account | null;
}

function CommunicationErrorLogsTable(props: CommunicationErrorLogsTableProps): JSX.Element {
  const { data, isLoading } = useCommunicationErrorLogs(props.ims, props.account);

  return (
    <GenericTabWithTableView
      descriptionId="logs.communicationErrorsDescription"
      description="Shows any reported communication errors with Amazon."
      tableAriaLabel="communication errors logs table"
      tableColumns={communicationErrorsLogColumns}
      items={data.collection}
      isLoading={isLoading}
      itemKey="id"
    />
  );
}

interface ListingChangesTableProps {
  ims: IMSContextProps;
  account: Account | null;
}

function ListingChangesTable(props: ListingChangesTableProps): JSX.Element {
  const { data, isLoading } = useListingChanges(props.ims, props.account);
  return (
    <GenericTabWithTableView
      descriptionId="logs.listingChangesDescription"
      description="Displays all changes made to listings associated with Amazon store."
      tableAriaLabel="listing changes logs table"
      tableColumns={listingChangesLogColumns}
      isLoading={isLoading}
      items={data.collection}
      itemKey="id"
    />
  );
}

interface LogsTabsProps {
  ims: IMSContextProps;
  account: Account | null;
}

function LogsTabs(props: LogsTabsProps) {
  const tabs: Array<Tab> = [
    {
      id: 1,
      name: <FormattedMessage id="logs.listingChangesTab" defaultMessage="Listing Changes Log" />,
      textValue: 'Listing Changes',
      children: <ListingChangesTable ims={props.ims} account={props.account} />,
    },
    {
      id: 2,
      name: (
        <FormattedMessage
          id="logs.communicationErrorsTab"
          defaultMessage="Communication Errors Log"
        />
      ),
      textValue: 'Communication Errors',
      children: <CommunicationErrorLogsTable ims={props.ims} account={props.account} />,
    },
  ];

  return (
    <>
      <Tabs aria-label="Logs tabs" items={tabs} orientation="horizontal" isEmphasized={true}>
        <TabList>
          {(item: Tab) => (
            <Item key={item.id} textValue={item.textValue}>
              {item.name}
            </Item>
          )}
        </TabList>
        <TabPanels>{(item: Tab) => <Item key={item.id}>{item.children}</Item>}</TabPanels>
      </Tabs>
    </>
  );
}

export const Logs = () => {
  const navigate = useNavigate();
  const imsProps = useImsContext();

  const { account, isLoading } = useAccount(imsProps);

  return isLoading ? (
    <Loader />
  ) : (
    <View margin={10}>
      <Heading level={2}>
        <FormattedMessage id="logs.title" defaultMessage="Amazon Sales Channel Logs" />
      </Heading>
      <Divider size="S" marginTop={10} />
      <View backgroundColor="gray-200">
        <Flex direction="row" alignItems="center" justifyContent="space-between">
          <StoreInfo account={account} limitedInfo={true} />
          <View margin={10}>
            <Button variant={'primary'} onPress={() => navigate(-1)} isQuiet>
              <Back />
              <Text>
                <FormattedMessage id="app.back" defaultMessage="Back" />
              </Text>
            </Button>
          </View>
        </Flex>
      </View>
      <View margin={10}>
        <LogsTabs ims={imsProps} account={account} />
      </View>
    </View>
  );
};
