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
  ActionGroup,
  Cell,
  Column,
  Content,
  Dialog,
  Flex,
  Item,
  Row,
  TableBody,
  TableHeader,
  TableView,
  TabList,
  TabPanels,
  Tabs,
} from '@adobe/react-spectrum';
import React from 'react';
import Close from '@spectrum-icons/workflow/Close';
import AddAttributesForm from './Attributes/AddAttributesForm';
import AttributeMap = AmazonSalesChannel.Model.AttributeMap;
import CommerceProductAttribute = AmazonSalesChannel.Model.CommerceProductAttribute;

interface AttributesTabsProps {
  commerceAttributeMap: Map<string, CommerceProductAttribute>;
  commerceProductAttributes: Array<CommerceProductAttribute>;
  isLoadingProductsAttributes: boolean;
  attribute: AttributeMap;
  onClose: () => void;
  onSave: (attribute: AttributeMap) => void;
  listAttributeValues: {
    region: string;
    productSku: string;
    asin: string;
    amazonValue: string;
    status: string;
  }[];
}

const valuesColumns = [
  { name: 'Region', uid: 'region' },
  { name: 'Adobe Commerce Products SKU', uid: 'productSku' },
  { name: 'ASIN', uid: 'asin' },
  { name: 'Amazon Value', uid: 'amazonValue' },
  { name: 'Status', uid: 'status' },
];

export default function AttributesTabs(props: Readonly<AttributesTabsProps>): JSX.Element {
  const [tabs] = React.useState([
    {
      name: 'Create / Edit Attribute',
      id: 1,
      children: (
        <AddAttributesForm
          isLoadingProductsAttributes={props.isLoadingProductsAttributes}
          commerceProductAttributes={props.commerceProductAttributes}
          commerceAttributeMap={props.commerceAttributeMap}
          attribute={props.attribute}
          onClose={props.onClose}
          onSave={props.onSave}
        />
      ),
    },
    {
      name: 'Matching Attribute Values',
      id: 2,
      children: (
        <Dialog>
          <Content>
            <TableView width="100%" overflowMode="wrap" aria-label="products">
              <TableHeader columns={valuesColumns}>
                {column => <Column key={column.uid}>{column.name}</Column>}
              </TableHeader>
              <TableBody items={props.listAttributeValues}>
                {item => (
                  <Row key={item.productSku}>{columnKey => <Cell>{item[columnKey]}</Cell>}</Row>
                )}
              </TableBody>
            </TableView>
          </Content>
        </Dialog>
      ),
    },
  ]);
  type Tab = (typeof tabs)[0];
  return (
    <>
      <Dialog>
        <Content>
          <Tabs aria-label="Tabs" items={tabs}>
            <Flex>
              <TabList flex="1 1 auto" minWidth="0px">
                {(item: Tab) => <Item key={item.name}>{item.name}</Item>}
              </TabList>
              <div
                style={{
                  display: 'flex',
                  flex: '0 0 auto',
                  borderBottom:
                    'var(--spectrum-alias-border-size-thick) solid var(--spectrum-global-color-gray-300)',
                }}
              >
                <ActionGroup isQuiet onAction={props.onClose}>
                  <Item key="close" aria-label="Close">
                    <Close />
                  </Item>
                </ActionGroup>
              </div>
            </Flex>
            <TabPanels>{(item: Tab) => <Item key={item.name}>{item.children}</Item>}</TabPanels>
          </Tabs>
        </Content>
      </Dialog>
    </>
  );
}
