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

export const useAmazonOrders = props => {
  const [isLoadingAmazonOrders, setIsLoadingAmazonOrders] = useState(true);
  const [amazonOrders, setAmazonOrders] = useState([]);

  const fetchOrders = async () => {
    setAmazonOrders([]);
    const d = new Date(props.createdAfter);
    const createdAfter = d.toISOString();
    const response = await callAction(props, 'amazon-get-orders', '', {
      createdAfter,
      account: props.account,
    });
    setAmazonOrders(response.Orders);
  };

  useEffect(() => {
    fetchOrders()
      .then(() => setIsLoadingAmazonOrders(false))
      .catch(() => {});
  }, []);

  return { isLoadingAmazonOrders, amazonOrders };
};
