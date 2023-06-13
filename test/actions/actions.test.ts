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

import { main as addAccountAddAction } from '../../actions-src/api/account/runtime/addAccount';
import { main as deleteAccountAction } from '../../actions-src/api/account/runtime/deleteAccount';
import { main as getAccountsAction } from '../../actions-src/api/account/runtime/getAccounts';
import { main as getCredentialsAction } from '../../actions-src/api/account/runtime/getCredentials';
import { main as migrateAccountAction } from '../../actions-src/api/account/runtime/migrateAccount';
import { main as storeCredentialsAction } from '../../actions-src/api/account/runtime/storeCredentials';
import { main as validateAccountAction } from '../../actions-src/api/account/runtime/validateAccount';
import { main as addMappingAction } from '../../actions-src/api/attribute/runtime/addMapping';
import { main as getCommunicationErrorLogsAction } from '../../actions-src/api/audit/runtime/getCommunicationErrorLogs';
import { main as getListingChangesAction } from '../../actions-src/api/audit/runtime/getListingChanges';
import { main as addProductsAction } from '../../actions-src/api/product/runtime/addProducts';
import { main as countProductsAction } from '../../actions-src/api/product/runtime/countProducts';
import { main as deleteProductsAction } from '../../actions-src/api/product/runtime/deleteProducts';
import { main as getAttributesAction } from '../../actions-src/api/product/runtime/getAttributes';
import { main as getProductAction } from '../../actions-src/api/product/runtime/getProduct';
import { main as getProductsAction } from '../../actions-src/api/product/runtime/getProducts';
import { main as updateProductsByAttributesAction } from '../../actions-src/api/product/runtime/updateProductsByAttributes';
import { main as getListingImprovementsAction } from '../../actions-src/api/reports/runtime/getListingImprovements';

import { main as amazonListOrdersAction } from '../../actions-src/amazon/order/runtime/listOrders';
import { main as amazonListProductsAction } from '../../actions-src/amazon/product/runtime/listProducts';
import { main as amazonGetListingOffersAction } from '../../actions-src/amazon/reports/runtime/getListingOffers';
import { main as amazonListCompetitivePricesAction } from '../../actions-src/amazon/reports/runtime/listCompetitivePrices';
import { main as amazonGetOrderMetricsAction } from '../../actions-src/amazon/sales/runtime/getOrderMetrics';

import { main as commerceGetRestAction } from '../../actions-src/commerce/runtime/getRest';
import { main as updateProductListenerAction } from '../../actions-src/commerce/product/runtime/listener/updateProduct';

test('Runtime actions defined with main function', () => {
  expect(addAccountAddAction).toBeInstanceOf(Function);
  expect(deleteAccountAction).toBeInstanceOf(Function);
  expect(getAccountsAction).toBeInstanceOf(Function);
  expect(getCredentialsAction).toBeInstanceOf(Function);
  expect(migrateAccountAction).toBeInstanceOf(Function);
  expect(storeCredentialsAction).toBeInstanceOf(Function);
  expect(validateAccountAction).toBeInstanceOf(Function);
  expect(addMappingAction).toBeInstanceOf(Function);
  expect(getCommunicationErrorLogsAction).toBeInstanceOf(Function);
  expect(getListingChangesAction).toBeInstanceOf(Function);
  expect(addProductsAction).toBeInstanceOf(Function);
  expect(countProductsAction).toBeInstanceOf(Function);
  expect(deleteProductsAction).toBeInstanceOf(Function);
  expect(getAttributesAction).toBeInstanceOf(Function);
  expect(getProductAction).toBeInstanceOf(Function);
  expect(getProductsAction).toBeInstanceOf(Function);
  expect(updateProductsByAttributesAction).toBeInstanceOf(Function);
  expect(getListingImprovementsAction).toBeInstanceOf(Function);

  expect(amazonListOrdersAction).toBeInstanceOf(Function);
  expect(amazonListProductsAction).toBeInstanceOf(Function);
  expect(amazonGetListingOffersAction).toBeInstanceOf(Function);
  expect(amazonListCompetitivePricesAction).toBeInstanceOf(Function);
  expect(amazonGetOrderMetricsAction).toBeInstanceOf(Function);

  expect(commerceGetRestAction).toBeInstanceOf(Function);
  expect(updateProductListenerAction).toBeInstanceOf(Function);
});
