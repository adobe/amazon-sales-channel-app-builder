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
import { Provider, lightTheme } from '@adobe/react-spectrum';
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SalesChannel } from './Amazon/salesChannel';
import { StoreView } from './Store/storeView';
import { ProductListings } from './Store/Listings/productListings';
import { AllOrders } from './Store/Listings/allOrders';
import { ListingRules } from './Store/Settings/listingRules';
import { ListingSettings } from './Store/Settings/ListingSettings/listingSettings';
import { OrderSettings } from './Store/Settings/orderSettings';
import { Logs } from './Store/Settings/AmazonLogs/Logs';
import { StoreReports } from './Store/Settings/StoreReports/storeReports';
import ExtensionRegistration from './extensionRegistration';
import { IMSProvider } from './Provider/ImsProvider';

function App(props) {
  console.log('runtime object:', props.runtime);
  console.log('ims object:', props.ims);

  // use exc runtime event handlers
  // respond to configuration change events (e.g. user switches org)
  props.runtime.on('configuration', ({ imsOrg, imsToken, locale }) => {
    console.log('configuration change', { imsOrg, imsToken, locale });
  });
  // respond to history change events
  props.runtime.on('history', ({ type, path }) => {
    console.log('history change', { type, path });
  });

  return (
    <ErrorBoundary onError={onError} FallbackComponent={fallbackComponent}>
      <BrowserRouter>
        <Provider theme={lightTheme} colorScheme={'light'}>
          <IMSProvider ims={props.ims} runtime={props.runtime}>
            <Routes>
              <Route index element={<SalesChannel runtime={props.runtime} ims={props.ims} />} />
              <Route path={'index.html'} element={<ExtensionRegistration />} />
              <Route
                path="/amazon/account/:accountId/orders"
                element={<AllOrders runtime={props.runtime} ims={props.ims} />}
              />
              <Route
                path="/amazon/account/:accountId"
                element={<StoreView runtime={props.runtime} ims={props.ims} />}
              />
              <Route
                path="/amazon/account/:accountId/listings/*"
                element={<ProductListings runtime={props.runtime} ims={props.ims} />}
              />
              <Route
                path="/amazon/account/listing_rules"
                element={<ListingRules runtime={props.runtime} ims={props.ims} />}
              />
              <Route
                path="/amazon/account/listing_settings"
                element={<ListingSettings runtime={props.runtime} ims={props.ims} />}
              />
              <Route
                path="/amazon/account/order_settings"
                element={<OrderSettings runtime={props.runtime} ims={props.ims} />}
              />
              <Route path="/amazon/account/:accountId/logs" element={<Logs />} />
              <Route
                path="/amazon/account/reports"
                element={<StoreReports runtime={props.runtime} ims={props.ims} />}
              />
            </Routes>
          </IMSProvider>
        </Provider>
      </BrowserRouter>
    </ErrorBoundary>
  );

  // Methods

  // component to show if UI fails rendering
  function fallbackComponent({ componentStack, error }) {
    return (
      <React.Fragment>
        <h1 style={{ textAlign: 'center', marginTop: '20px' }}>Something went wrong :(</h1>
        <pre>{`${componentStack}\n${error.message}`}</pre>
      </React.Fragment>
    );
  }
}

// error handler on UI rendering failure
function onError(e, componentStack) {}

export default App;
