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

import { useState } from 'react';
import { ComboBox, Form, Heading, Item, Text, View } from '@adobe/react-spectrum';
import { genericContextualHelp, genericListContextualHelp } from './utils';

export const FulfilledBy = props => {
  const [productFulfilledById, setProductFulfilledById] = useState(
    props.listingSettings.productFulfilledById ?? 1,
  );

  const productFulfilledBy = [
    { id: 1, name: 'Fulfilled by Merchant' },
    { id: 2, name: 'Fulfilled by Amazon' },
    { id: 3, name: 'Assign Fulfilled By Using Adobe Commerce Product Attribute' },
  ];

  const productFulfilledByIdOnChange = selectedId => {
    setProductFulfilledById(selectedId);
    props.listingSettings.productFulfilledById = selectedId;
  };

  const productFulfilledByContextualHelpItems = [
    {
      key: 1,
      value:
        'Fulfilled by Merchant - (FBM) Choose if you fulfill the orders. When an order is placed, inventory is deducted from your Commerce catalog. When a new product is created, the fulfillment method of Merchant Fulfilled is assigned.',
    },
    {
      key: 2,
      value:
        'Fulfilled by Amazon - (FBA) Choose if Amazon fulfills the orders. With this fulfillment method, product inventory is not deducted from your Commerce catalog when an order is placed. When a product is created, it is created with Fulfilled by Amazon (FBA) as the fulfillment type. Ensure that your products are eligible for FBA fulfillment within your Amazon Seller Central account. FBA inventory is also directly managed through your Amazon Seller Central account. With this fulfillment method, quantity updates are not pushed out relative to your Commerce catalog, so you cannot use some of the marketing tools described in Stock / Quantity Settings.',
    },
    {
      key: 3,
      value:
        'Assign Fulfilled By Using Magento Product Attribute - Choose if you have an existing Commerce attribute that determines if it is fulfilled by the merchant or fulfilled by Amazon. When chosen, Fulfilled by Attribute enables.',
    },
  ];

  return (
    <View marginStart={10}>
      <Heading level={2}>Fulfilled By</Heading>
      <Text>Control whether Amazon listings are fulfilled by merchant or Amazon</Text>
      <Form
        marginTop={10}
        labelPosition="side"
        labelAlign="start"
        aria-labelledby="third-party-listings"
      >
        <ComboBox
          flex
          label="Product Fulfilled By"
          contextualHelp={genericListContextualHelp(
            'Product Fulfilled By',
            productFulfilledByContextualHelpItems,
          )}
          items={productFulfilledBy}
          selectedKey={productFulfilledById}
          onSelectionChange={productFulfilledByIdOnChange}
        >
          {item => <Item>{item.name}</Item>}
        </ComboBox>
        <ComboBox
          flex
          label="Fulfilled By Attribute"
          contextualHelp={genericContextualHelp('Fulfilled By Attribute', [
            'Choose the Commerce attribute used to determine the fulfillment method.',
            'For example, if the attribute is Fulfilled By and you choose the attribute value as Fulfilled By Merchant or Fulfilled By Amazon (FBA), the system uses that value as the fulfillment type for a new product. As a merchant, you should ensure that your products are eligible for FBA fulfillment within your Amazon Seller Central account. FBA inventory is also directly managed through your Amazon Seller Account.',
            'Options depend on the attributes you set up for your Amazon products.',
          ])}
          items={[]} // TODO Check how to fill data
          selectedKey={0}
          isRequired
          isDisabled={productFulfilledById !== 3}
        >
          {item => <Item>{item.name}</Item>}
        </ComboBox>
      </Form>
    </View>
  );
};
