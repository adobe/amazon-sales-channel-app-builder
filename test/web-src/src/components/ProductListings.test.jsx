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
import {
  ACTION,
  AMAZON_QUANTITY,
  AMAZON_SKU,
  ASIN,
  BUY_BOX_WON,
  CONDITION,
  INACTIVE_REASON,
  LANDED_PRICE,
  LISTING_PRICE,
  PRODUCT_LISTING_NAME,
  STATUS,
} from '../../../../web-src/src/components/Store/Listings/ProductListings/columns';
import { customRender, screenDefault } from '../utils';
import {
  ActiveListings,
  InactiveListings,
  IncompleteListings,
  NewThirdPartyListings,
  ReadyListings,
} from '../../../../web-src/src/components/Store/Listings/ProductListings/Tables';

describe('ProductListings', () => {
  const defaultProps = {
    products: [],
    isLoading: false,
  };

  beforeAll(() => {
    screenDefault({
      height: 1024,
      width: 1920,
    });
  });

  it('should display all incomplete product columns', () => {
    customRender(<IncompleteListings {...defaultProps} />);

    expect(screen.queryByText(AMAZON_SKU.name)).toBeInTheDocument();
    expect(screen.queryByText(ASIN.name)).toBeInTheDocument();
    expect(screen.queryByText(PRODUCT_LISTING_NAME.name)).toBeInTheDocument();
    expect(screen.queryByText(CONDITION.name)).toBeInTheDocument();
    expect(screen.queryByText(LISTING_PRICE.name)).toBeInTheDocument();
    expect(screen.queryByText(LANDED_PRICE.name)).toBeInTheDocument();
    expect(screen.queryByText(AMAZON_QUANTITY.name)).toBeInTheDocument();
    expect(screen.queryByText(STATUS.name)).toBeInTheDocument();
    expect(screen.queryByText(ACTION.name)).toBeInTheDocument();
  });

  it('should display all new third party product columns', () => {
    customRender(<NewThirdPartyListings {...defaultProps} />);

    expect(screen.queryByText(AMAZON_SKU.name)).toBeInTheDocument();
    expect(screen.queryByText(ASIN.name)).toBeInTheDocument();
    expect(screen.queryByText(PRODUCT_LISTING_NAME.name)).toBeInTheDocument();
    expect(screen.queryByText(CONDITION.name)).toBeInTheDocument();
    expect(screen.queryByText(LISTING_PRICE.name)).toBeInTheDocument();
    expect(screen.queryByText(AMAZON_QUANTITY.name)).toBeInTheDocument();
    expect(screen.queryByText(STATUS.name)).toBeInTheDocument();
    expect(screen.queryByText(ACTION.name)).toBeInTheDocument();
  });

  it('should display all ready to list product columns', () => {
    customRender(<ReadyListings {...defaultProps} />);

    expect(screen.queryByText(AMAZON_SKU.name)).toBeInTheDocument();
    expect(screen.queryByText(ASIN.name)).toBeInTheDocument();
    expect(screen.queryByText(PRODUCT_LISTING_NAME.name)).toBeInTheDocument();
    expect(screen.queryByText(CONDITION.name)).toBeInTheDocument();
    expect(screen.queryByText(LISTING_PRICE.name)).toBeInTheDocument();
    expect(screen.queryByText(LANDED_PRICE.name)).toBeInTheDocument();
    expect(screen.queryByText(AMAZON_QUANTITY.name)).toBeInTheDocument();
    expect(screen.queryByText(STATUS.name)).toBeInTheDocument();
    expect(screen.queryByText(ACTION.name)).toBeInTheDocument();
  });

  it('should display all inactive product columns', () => {
    customRender(<InactiveListings {...defaultProps} />);

    expect(screen.queryByText(AMAZON_SKU.name)).toBeInTheDocument();
    expect(screen.queryByText(ASIN.name)).toBeInTheDocument();
    expect(screen.queryByText(PRODUCT_LISTING_NAME.name)).toBeInTheDocument();
    expect(screen.queryByText(CONDITION.name)).toBeInTheDocument();
    expect(screen.queryByText(LISTING_PRICE.name)).toBeInTheDocument();
    expect(screen.queryByText(LANDED_PRICE.name)).toBeInTheDocument();
    expect(screen.queryByText(AMAZON_QUANTITY.name)).toBeInTheDocument();
    expect(screen.queryByText(STATUS.name)).toBeInTheDocument();
    expect(screen.queryByText(INACTIVE_REASON.name)).toBeInTheDocument();
    expect(screen.queryByText(ACTION.name)).toBeInTheDocument();
  });

  it('should display all active product columns', () => {
    customRender(<ActiveListings {...defaultProps} />);

    expect(screen.queryByText(AMAZON_SKU.name)).toBeInTheDocument();
    expect(screen.queryByText(ASIN.name)).toBeInTheDocument();
    expect(screen.queryByText(PRODUCT_LISTING_NAME.name)).toBeInTheDocument();
    expect(screen.queryByText(CONDITION.name)).toBeInTheDocument();
    expect(screen.queryByText(LISTING_PRICE.name)).toBeInTheDocument();
    expect(screen.queryByText(LANDED_PRICE.name)).toBeInTheDocument();
    expect(screen.queryByText(AMAZON_QUANTITY.name)).toBeInTheDocument();
    expect(screen.queryByText(BUY_BOX_WON.name)).toBeInTheDocument();
    expect(screen.queryByText(STATUS.name)).toBeInTheDocument();
    expect(screen.queryByText(ACTION.name)).toBeInTheDocument();
  });
});
