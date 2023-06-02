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

import { FormattedMessage } from 'react-intl';
import { Item, TabList, TabPanels, Tabs } from '@adobe/react-spectrum';
import { AccountsListing } from '../Store/Listings/accountsListing';
import { LearningAndPreparation } from './learningAndPreparation';
import { Attributes } from './Attributes';

export const SalesChannelTabs = props => {
  const tabs = [
    {
      id: 1,
      name: <FormattedMessage id="app.amazon-stores" defaultMessage="Amazon Stores" />,
      children: (
        <AccountsListing runtime={props.runtime} ims={props.ims} accounts={props.accounts} />
      ),
    },
    {
      id: 2,
      name: (
        <FormattedMessage
          id="app.learning-and-preparation"
          defaultMessage="Learning and Preparation"
        />
      ),
      children: <LearningAndPreparation />,
    },
    {
      id: 3,
      name: <FormattedMessage id="app.attributes" defaultMessage="Attributes" />,
      children: <Attributes runtime={props.runtime} ims={props.ims} />,
    },
  ];

  return (
    <>
      <Tabs
        aria-label="Amazon Sales Channel"
        items={tabs}
        orientation="vertical"
        isEmphasized={true}
        selectedKey={props.tab}
        onSelectionChange={props.onSelectionTabChange}
      >
        <TabList>{item => <Item>{item.name}</Item>}</TabList>
        <TabPanels>{item => <Item>{item.children}</Item>}</TabPanels>
      </Tabs>
    </>
  );
};
