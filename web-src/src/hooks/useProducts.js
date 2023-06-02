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

import { useEffect, useState } from 'react';
import { callAction } from '../utils';

export const useProducts = (props, account) => {
  const productsByStatus = {
    active: [],
    inactive: [],
    incomplete: [],
    newThirdParty: [],
    readyToList: [],
    ineligible: [],
    ended: [],
    overrides: [],
  };

  const [state, setState] = useState({
    isLoadingProducts: true,
    products: productsByStatus,
  });

  const fetchProducts = async () => {
    const sellerId = account.sellerId;
    const countryId = account.countryId;
    for (const productStatus in productsByStatus) {
      if (Object.hasOwn(productsByStatus, productStatus)) {
        const response = await callAction(props, 'api-get-products', '', {
          sellerId,
          countryId,
          productStatus,
        });
        productsByStatus[productStatus] = response.collection;
      }
    }

    setState({
      ...state,
      isLoadingProducts: false,
      products: productsByStatus,
    });
  };

  useEffect(() => {
    fetchProducts();
  }, [account]);

  return state;
};

export const useCountProductsByStatus = (props, accounts, productStatus) => {
  const products = {};
  const [state, setState] = useState({
    isLoadingProducts: true,
    products,
  });

  const fetchProducts = async () => {
    for (const index in accounts) {
      if (Object.hasOwn(accounts, index)) {
        const account = accounts[index];
        const sellerId = account.sellerId;
        const countryId = account.countryId;

        const response = await callAction(props, 'api-count-products', '', {
          sellerId,
          countryId,
          productStatus,
        });
        products[account.id] = response?.count ?? 0;

        setState({
          ...state,
          isLoadingProducts: false,
          products,
        });
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [accounts]);

  return state;
};
