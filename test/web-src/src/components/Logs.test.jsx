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
  communicationErrorsLogColumns,
  listingChangesLogColumns,
  AMAZON_STORE_NAME,
  COMMENTS,
  CREATED_ON,
  ERROR_CODE,
  ID,
  LISTING_ACTION,
  MERCHANT_ID,
  MESSAGE,
  REGION,
  SELLER_SKU,
} from '../../../../web-src/src/components/Store/Settings/AmazonLogs/columns';

describe('Logs', () => {
  beforeAll(() => {
    screenDefault({
      height: 1024,
      width: 1920,
    });
  });

  it('should display all listing changes log columns', () => {
    customRender(
      <GenericTabWithTableView
        descriptionId="logs.listingChangesDescription"
        description="Displays all changes made to listings associated with Amazon store."
        tableAriaLabel="listing changes logs table"
        tableColumns={listingChangesLogColumns}
        items={[]}
      />,
    );

    expect(screen.queryByText(ID.name)).toBeInTheDocument();
    expect(screen.queryByText(MERCHANT_ID.name)).toBeInTheDocument();
    expect(screen.queryByText(AMAZON_STORE_NAME.name)).toBeInTheDocument();
    expect(screen.queryByText(SELLER_SKU.name)).toBeInTheDocument();
    expect(screen.queryByText(REGION.name)).toBeInTheDocument();
    expect(screen.queryByText(LISTING_ACTION.name)).toBeInTheDocument();
    expect(screen.queryByText(COMMENTS.name)).toBeInTheDocument();
    expect(screen.queryByText(CREATED_ON.name)).toBeInTheDocument();
  });

  it('should display all communication errors log columns', () => {
    customRender(
      <GenericTabWithTableView
        descriptionId="logs.communicationErrorsDescription"
        description="Shows any reported communication errors with Amazon."
        tableAriaLabel="communication errors logs table"
        tableColumns={communicationErrorsLogColumns}
        items={[]}
      />,
    );

    expect(screen.queryByText(ID.name)).toBeInTheDocument();
    expect(screen.queryByText(MERCHANT_ID.name)).toBeInTheDocument();
    expect(screen.queryByText(AMAZON_STORE_NAME.name)).toBeInTheDocument();
    expect(screen.queryByText(REGION.name)).toBeInTheDocument();
    expect(screen.queryByText(ERROR_CODE.name)).toBeInTheDocument();
    expect(screen.queryByText(MESSAGE.name)).toBeInTheDocument();
    expect(screen.queryByText(CREATED_ON.name)).toBeInTheDocument();
  });
});
