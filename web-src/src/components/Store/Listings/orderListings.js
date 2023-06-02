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
  Cell,
  Column,
  Content,
  IllustratedMessage,
  Row,
  TableBody,
  TableHeader,
  TableView,
} from '@adobe/react-spectrum';
import { useAsyncList } from 'react-stately';
import { useAmazonOrders } from '../../../hooks/useAmazonOrders';

export const OrderListings = props => {
  const { amazonOrders } = useAmazonOrders(props);

  const orders = useAsyncList({
    async load() {
      const parsedOrders = [];
      for (const order in amazonOrders) {
        if (Object.hasOwn(amazonOrders, order)) {
          parsedOrders.push({
            'purchase-date': order.PurchaseDate,
            'order-number': order.AmazonOrderId,
            'status': order.OrderStatus,
            'buyer-name': order.BuyerInfo.BuyerName,
            'total': order.OrderTotal,
          });
        }
      }
      return {
        items: parsedOrders,
      };
    },
  });

  const ordersColumns = [
    { name: 'Purchase date', uid: 'purchase-date' },
    { name: 'Order number', uid: 'order-number' },
    { name: 'Status', uid: 'status' },
    { name: "Buyer's name", uid: 'buyer-name' },
    { name: 'Total', uid: 'total' },
    { name: 'Order notes', uid: 'order-notes' },
  ];

  function renderEmptyState() {
    return (
      <IllustratedMessage>
        <Content>No data available</Content>
      </IllustratedMessage>
    );
  }

  return (
    <TableView
      overflowMode="wrap"
      aria-label="orders table"
      flex
      renderEmptyState={renderEmptyState}
      height="static-size-1000"
    >
      <TableHeader columns={ordersColumns}>
        {column => <Column key={column.uid}>{column.name}</Column>}
      </TableHeader>
      <TableBody items={orders.items} loadingState={orders.loadingState}>
        {order => (
          <Row key={order['order-number']}>{columnKey => <Cell>{order[columnKey]}</Cell>}</Row>
        )}
      </TableBody>
    </TableView>
  );
};
