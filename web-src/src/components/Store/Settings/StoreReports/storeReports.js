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
  Button,
  ButtonGroup,
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
import { FormattedMessage } from 'react-intl';
import Back from '@spectrum-icons/workflow/Back';
import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { StoreInfo } from '../../storeInfo';
import { competitivePriceAnalysisColumns, listingImprovementsColumns } from './columns';
import { useCommerceProducts } from '../../../../hooks/useCommerceProducts';
import { useCompetitivePriceAnalysis } from '../../../../hooks/useCompetitivePriceAnalysis';
import { GenericTabWithTableView } from '../../Listings/ProductListings/Tables';
import { useAmazonListingImprovements } from '../../../../hooks/useListingImprovements';

export const StoreReports = props => {
  const location = useLocation();
  const navigate = useNavigate();
  const account = location.state.account;
  const rowItemKey = 'id';
  const rowItemKeyListingImprovements = 'amazonSellerSku';
  const { isLoadingCommerceProducts, commerceProducts } = useCommerceProducts(props);
  const PRODUCTS_PER_PAGE = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const { isLoadingCompetitivePrices, pagedProducts } = useCompetitivePriceAnalysis(
    props,
    commerceProducts,
    currentPage,
    PRODUCTS_PER_PAGE,
    account,
  );
  const { isLoadingAmazonListingImprovements, amazonListingImprovements } =
    useAmazonListingImprovements(props, account.id);
  const [mappedListingImprovements, setMappedListingImprovements] = useState([]);

  useEffect(() => {
    if (!isLoadingAmazonListingImprovements) {
      const list = amazonListingImprovements.map(listing => ({
        amazonSellerSku: listing.SKU,
        asin: listing.ASIN,
        alert_type: listing.Reason,
        field_name: extractFieldName(listing['Issue Description']),
        notes: listing['Issue Description'],
        account: account.storeName,
      }));
      setMappedListingImprovements(list);
    }
  }, [isLoadingAmazonListingImprovements]);

  function StoreReportsTabs() {
    const tabs = [
      {
        id: 1,
        name: (
          <FormattedMessage
            id="storeReports.competitivePriceAnalysis"
            defaultMessage="Competitive Price Analysis"
          />
        ),
        children: (
          <>
            {isLoadingCommerceProducts || isLoadingCompetitivePrices ? (
              <Flex alignItems="center" justifyContent="center" height="100vh">
                <ProgressCircle size="L" aria-label="Loading…" isIndeterminate />
              </Flex>
            ) : (
              <>
                <ButtonGroup>
                  {currentPage > 1 ? (
                    <Button
                      variant="secondary"
                      onPress={() => setCurrentPage(currentPage => currentPage - 1)}
                    >
                      Previous
                    </Button>
                  ) : null}
                  {currentPage < commerceProducts.length / PRODUCTS_PER_PAGE ? (
                    <Button
                      variant="secondary"
                      onPress={() => setCurrentPage(currentPage => currentPage + 1)}
                    >
                      Next
                    </Button>
                  ) : null}
                </ButtonGroup>
                <GenericTabWithTableView
                  descriptionId="storeReports.competitivePriceAnalysisDescription"
                  description="Displays your Amazon landed price in relation to Buy Box and lowest price."
                  tableAriaLabel="competitive price analysis table"
                  tableColumns={competitivePriceAnalysisColumns}
                  items={pagedProducts}
                  itemKey={rowItemKey}
                />
              </>
            )}
          </>
        ),
      },
      {
        id: 2,
        name: (
          <FormattedMessage
            id="storeReports.listingImprovements"
            defaultMessage="Listing Improvements"
          />
        ),
        children: (
          <>
            {isLoadingAmazonListingImprovements ? (
              <Flex alignItems="center" justifyContent="center" height="100vh">
                <ProgressCircle size="L" aria-label="Loading…" isIndeterminate />
              </Flex>
            ) : (
              <GenericTabWithTableView
                descriptionId="storeReports.listingImprovementsDescription"
                description="Displays all suggested listing improvements provided by Amazon for this marketplace"
                tableAriaLabel="listing improvements table"
                tableColumns={listingImprovementsColumns}
                items={mappedListingImprovements}
                itemKey={rowItemKeyListingImprovements}
              />
            )}
          </>
        ),
      },
    ];

    return (
      <>
        <Tabs
          aria-label="Store reports tabs"
          items={tabs}
          orientation="horizontal"
          isEmphasized={true}
        >
          <TabList>{item => <Item textValue={item.name}>{item.name}</Item>}</TabList>
          <TabPanels>{item => <Item textValue={item.name}>{item.children}</Item>}</TabPanels>
        </Tabs>
      </>
    );
  }

  return (
    <View margin={10}>
      <Heading level={2}>
        <FormattedMessage id="storeReports.title" defaultMessage="Store Reports" />
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
        <StoreReportsTabs />
      </View>
    </View>
  );
};

function extractFieldName(notes) {
  const matches = notes.match(/^'\[([\s\w-]+)]'/);
  if (matches && matches[1]) {
    // eslint-disable-next-line prefer-destructuring
    return matches[1];
  }
  return '';
}
