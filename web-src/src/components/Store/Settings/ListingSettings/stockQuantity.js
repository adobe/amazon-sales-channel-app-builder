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

import { useState, useMemo } from 'react';
import { Form, Heading, Text, TextField, View } from '@adobe/react-spectrum';
import { genericContextualHelp, isValidQuantity } from './utils';

export const StockQuantity = props => {
  const [formState, setFormState] = useState({
    outOfStockThreshold: props.listingSettings.outOfStockThreshold ?? '0',
    maximumListedQuantity: props.listingSettings.maximumListedQuantity ?? '10000',
    doNotManageStockQuantity: props.listingSettings.doNotManageStockQuantity ?? '100',
  });

  const onChange = (field, value) => {
    formState[field] = value;
    setFormState(() => ({ ...formState }));
    props.listingSettings[field] = value;
  };

  const isThresholdValid = useMemo(
    () => isValidQuantity(formState.outOfStockThreshold),
    [formState.outOfStockThreshold],
  );

  const isMaximumListedQuantityValid = useMemo(
    () => isValidQuantity(formState.maximumListedQuantity),
    [formState.maximumListedQuantity],
  );

  const isDoNotManageStockQuantityValid = useMemo(
    () => isValidQuantity(formState.doNotManageStockQuantity),
    [formState.doNotManageStockQuantity],
  );

  return (
    <View marginStart={10}>
      <Heading level={2}>Stock / Quantity</Heading>
      <Text>Control aspects of stock management across the Amazon marketplace</Text>
      <Form
        marginTop={10}
        labelPosition="side"
        labelAlign="start"
        aria-labelledby="third-party-listings"
      >
        <TextField
          contextualHelp={genericContextualHelp('Out-of-Stock Threshold', [
            'Enter a numerical value for the lowest quantity of a product in order to keep the product eligible for its Amazon listing (default is 0). If your Commerce product stock goes lower than this number, the respective Amazon listing is ineligible for sales through Amazon.',
          ])}
          label="Out-of-Stock Threshold"
          value={formState.outOfStockThreshold}
          onChange={value => onChange('outOfStockThreshold', value)}
          validationState={isThresholdValid ? 'valid' : 'invalid'}
          isRequired
        />
        <TextField
          contextualHelp={genericContextualHelp('', [
            'Enter a numerical value for the quantity you want to show in your Amazon listing.',
            'When an item is sold, the Amazon listing republishes with the quantity entered here. This setting is typically used when you do not manage product inventory.',
            'For example, you enter the Maximum Listed Quantity value as 10. Your actual quantity for a product is 80. Because you have set this value at 10, the Amazon listing always displays a quantity available of 10. The quantity available is always displayed with the value defined, even when your stock quantity is lower.',
          ])}
          label="Maximum Listed Quantity"
          value={formState.maximumListedQuantity}
          onChange={value => onChange('maximumListedQuantity', value)}
          validationState={isMaximumListedQuantityValid ? 'valid' : 'invalid'}
          isRequired
        />
        <TextField
          contextualHelp={genericContextualHelp('"Do Not Manage Stock" Quantity', [
            'Enter a value for your display quantity for your Amazon listings.',
            'Amazon requires that you publish an available quantity. For Commerce products that are set to not manage stock but you want to list them on Amazon, the listing is published with available quantity of the value entered here.',
          ])}
          label="&ldquo;Do Not Manage Stock&rdquo; Quantity"
          value={formState.doNotManageStockQuantity}
          onChange={value => onChange('doNotManageStockQuantity', value)}
          validationState={isDoNotManageStockQuantityValid ? 'valid' : 'invalid'}
          isRequired
        />
      </Form>
    </View>
  );
};
