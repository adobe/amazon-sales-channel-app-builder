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

import React from 'react';

import {
  Button,
  Cell,
  Content,
  Flex,
  IllustratedMessage,
  Link,
  Row,
  TableBody,
  TableHeader,
  TableView,
  View,
} from '@adobe/react-spectrum';
import { FormattedMessage } from 'react-intl';
import { Column } from 'react-stately';
import Loader from '../../../Shared/Loader';
import { formatPrice } from '../../../../utils';
import {
  incompleteProductsColumns,
  newThirdPartyColumns,
  readyToListProductsColumns,
  inactiveProductsColumns,
  activeProductsColumns,
  overridesProductsColumns,
  ineligibleProductsColumns,
  endedProductsColumns,
} from './columns';

function renderEmptyState() {
  return (
    <IllustratedMessage>
      <Content>
        <FormattedMessage id="listings.noRecords" defaultMessage="We couldn't find any records" />
      </Content>
    </IllustratedMessage>
  );
}

function cellFormat(product, columnKey) {
  if (columnKey === 'landed_price') return formatPrice(product[columnKey]);
  return product[columnKey];
}

export const GenericTabWithTableView = props => (
  <View>
    <Content marginTop={20} marginBottom={20}>
      <Flex alignItems="center" justifyContent="space-between" marginX={20}>
        <FormattedMessage id={props.descriptionId} defaultMessage={props.description} />
        <Link>
          <a href={props.guideLink} target="_blank" rel="noreferrer">
            <Button variant={'secondary'}>
              <FormattedMessage id="app.viewUserGuide" defaultMessage="View User Guide" />
            </Button>
          </a>
        </Link>
      </Flex>
    </Content>
    {props.isLoading ? (
      <Loader />
    ) : (
      <TableView
        overflowMode="wrap"
        aria-label={props.tableAriaLabel}
        selectionMode="multiple"
        renderEmptyState={renderEmptyState}
        minHeight="static-size-1000"
        flex
      >
        <TableHeader columns={props.tableColumns}>
          {column => (
            <Column key={column.uid} align={column.uid === 'createdAt' ? 'end' : 'start'}>
              {column.name}
            </Column>
          )}
        </TableHeader>
        <TableBody items={props.items}>
          {item => (
            <Row key={item[props.itemKey]}>
              {columnKey => <Cell>{cellFormat(item, columnKey)}</Cell>}
            </Row>
          )}
        </TableBody>
      </TableView>
    )}
  </View>
);

const rowItemKey = 'sku';
const adobeCommerceChannelsDocs =
  'https://experienceleague.adobe.com/docs/commerce-channels/amazon/admin-listings/status-tab';

export function IncompleteListings({ products, isLoading }) {
  return (
    <GenericTabWithTableView
      isLoading={isLoading}
      descriptionId="listings.incompleteDescription"
      description="Product listings that are missing information. Update Required Info in Action column."
      tableAriaLabel="incomplete products table"
      tableColumns={incompleteProductsColumns}
      items={products}
      itemKey={rowItemKey}
      guideLink={`${adobeCommerceChannelsDocs}/incomplete-listings.html`}
    />
  );
}

export function NewThirdPartyListings({ products, isLoading }) {
  return (
    <GenericTabWithTableView
      isLoading={isLoading}
      descriptionId="listings.newThirdPartyDescription"
      description="Amazon product listings that are not matched to Adobe Commerce products."
      tableAriaLabel="new third party table"
      tableColumns={newThirdPartyColumns}
      items={products}
      itemKey={rowItemKey}
      guideLink={`${adobeCommerceChannelsDocs}/new-third-party-listings.html`}
    />
  );
}

export function InactiveListings({ products, isLoading }) {
  return (
    <GenericTabWithTableView
      isLoading={isLoading}
      descriptionId="listings.inactiveDescription"
      description="Product listings that have been published to Amazon but are not Active because of an Amazon error."
      tableAriaLabel="inactive products table"
      tableColumns={inactiveProductsColumns}
      items={products}
      itemKey={rowItemKey}
      guideLink={`${adobeCommerceChannelsDocs}/inactive-listings.html`}
    />
  );
}

export function ActiveListings({ products, isLoading }) {
  return (
    <GenericTabWithTableView
      isLoading={isLoading}
      descriptionId="listings.activeDescription"
      description="Product listings that have been published to Amazon and are ready for sale."
      tableAriaLabel="active products table"
      tableColumns={activeProductsColumns}
      items={products}
      itemKey={rowItemKey}
      guideLink={`${adobeCommerceChannelsDocs}/active-listings.html`}
    />
  );
}

export function OverrideListings({ products, isLoading }) {
  return (
    <GenericTabWithTableView
      isLoading={isLoading}
      descriptionId="listings.overridesDescription"
      description="Product listings that have specific overrides. Overrides take priority over any other account setting."
      tableAriaLabel="overrides products table"
      tableColumns={overridesProductsColumns}
      items={products}
      itemKey={rowItemKey}
      guideLink={`${adobeCommerceChannelsDocs}/overrides.html`}
    />
  );
}

export function IneligibleListings({ products, isLoading }) {
  return (
    <GenericTabWithTableView
      isLoading={isLoading}
      descriptionId="listings.ineligibleDescription"
      description="Product listings that are no longer eligible, based on your Listing Rules."
      tableAriaLabel="ineligible products table"
      tableColumns={ineligibleProductsColumns}
      items={products}
      itemKey={rowItemKey}
      guideLink={`${adobeCommerceChannelsDocs}/ineligible-listings.html`}
    />
  );
}

export function EndedListings({ products, isLoading }) {
  return (
    <GenericTabWithTableView
      isLoading={isLoading}
      descriptionId="listings.endedDescription"
      description="Product listings that have manually been removed from Amazon."
      tableAriaLabel="ended products table"
      tableColumns={endedProductsColumns}
      items={products}
      itemKey={rowItemKey}
      guideLink={`${adobeCommerceChannelsDocs}/ended-listings.html`}
    />
  );
}

export function ReadyListings({ products, isLoading }) {
  return (
    <GenericTabWithTableView
      isLoading={isLoading}
      descriptionId="listings.readyToListDescription"
      description="Eligible product listings that are ready to be published to Amazon."
      tableAriaLabel="ready to list products table"
      tableColumns={readyToListProductsColumns}
      items={products}
      itemKey={rowItemKey}
      guideLink={`${adobeCommerceChannelsDocs}/ready-to-list.html`}
    />
  );
}
