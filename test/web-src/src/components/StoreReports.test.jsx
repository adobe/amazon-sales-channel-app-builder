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
import { screen } from '@testing-library/react';
import { GenericTabWithTableView } from '../../../../web-src/src/components/Store/Listings/ProductListings/Tables';
import { customRender, screenDefault } from '../utils';
import {
  listingImprovementsColumns,
  competitivePriceAnalysisColumns,
  ACCOUNT_NAME,
  AMAZON_SELLER_SKU,
  ASIN,
  BUY_BOX_LANDED_PRICE,
  CONDITION_BUY_BOX,
  CONDITION_LOWEST_PRICE,
  IS_SELLER_BUY_BOX,
  LOWEST_LANDED_PRICE,
  PRODUCT_LISTING_NAME,
  YOUR_LANDED_PRICE,
  LISTING_ID,
  COMMERCE_PRODUCT_ID,
  ALERT_TYPE,
  FIELD_NAME,
  NOTES,
} from '../../../../web-src/src/components/Store/Settings/StoreReports/columns';

describe('Store reports', () => {
  beforeAll(() => {
    screenDefault({
      height: 1024,
      width: 1920,
    });
  });

  it('should display all competitive price analysis columns', () => {
    customRender(
      <GenericTabWithTableView
        descriptionId="storeReports.competitivePriceAnalysisDescription"
        description="Displays your Amazon landed price in relation to Buy Box and lowest price."
        tableAriaLabel="competitive price analysis table"
        tableColumns={competitivePriceAnalysisColumns}
        items={[]}
      />,
    );

    expect(screen.queryByText(AMAZON_SELLER_SKU.name)).toBeInTheDocument();
    expect(screen.queryByText(ASIN.name)).toBeInTheDocument();
    expect(screen.queryByText(PRODUCT_LISTING_NAME.name)).toBeInTheDocument();
    expect(screen.queryByText(YOUR_LANDED_PRICE.name)).toBeInTheDocument();
    expect(screen.queryByText(LOWEST_LANDED_PRICE.name)).toBeInTheDocument();
    expect(screen.queryByText(CONDITION_LOWEST_PRICE.name)).toBeInTheDocument();
    expect(screen.queryByText(BUY_BOX_LANDED_PRICE.name)).toBeInTheDocument();
    expect(screen.queryByText(IS_SELLER_BUY_BOX.name)).toBeInTheDocument();
    expect(screen.queryByText(CONDITION_BUY_BOX.name)).toBeInTheDocument();
  });

  it('should display all listing improvements columns', () => {
    customRender(
      <GenericTabWithTableView
        descriptionId="storeReports.listingImprovementsDescription"
        description="Displays all suggested listing improvements provided by Amazon for this marketplace"
        tableAriaLabel="listing improvements table"
        tableColumns={listingImprovementsColumns}
        items={[]}
      />,
    );

    expect(screen.queryByText(AMAZON_SELLER_SKU.name)).toBeInTheDocument();
    expect(screen.queryByText(ASIN.name)).toBeInTheDocument();
    expect(screen.queryByText(ALERT_TYPE.name)).toBeInTheDocument();
    expect(screen.queryByText(FIELD_NAME.name)).toBeInTheDocument();
    expect(screen.queryByText(NOTES.name)).toBeInTheDocument();
  });
});
