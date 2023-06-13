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

import React, { useState, useMemo, useCallback } from 'react';
import {
  ComboBox,
  Flex,
  Form,
  Heading,
  Item,
  NumberField,
  Text,
  View,
} from '@adobe/react-spectrum';
import { enabledDisabled, isValidQuantity } from './utils';

interface NumberFieldProps {
  label: string;
  field: string;
  enableTieredPricing: number;
  value: number;
  onChange: (field: string, value: unknown) => void;
}

type PriceQuantityProps = Readonly<NumberFieldProps>;
type PriceDiscountProps = Readonly<NumberFieldProps>;

function PriceQuantity(props: PriceQuantityProps): JSX.Element {
  const validationState: boolean = useMemo(() => isValidQuantity(props.value), [props.value]);

  return (
    <NumberField
      label={props.label}
      isHidden={props.enableTieredPricing === 0}
      value={props.value}
      onChange={value => props.onChange(props.field, value)}
      validationState={validationState ? 'valid' : 'invalid'}
    />
  );
}

function PriceDiscount(props: PriceDiscountProps): JSX.Element {
  const isValidPercentage = useCallback(
    (quantity: number) => !Number.isNaN(+quantity) && quantity >= 0 && quantity <= 100,
    [],
  );

  const validationState: boolean = useMemo(() => isValidPercentage(props.value), [props.value]);
  return (
    <NumberField
      marginStart={10}
      label={props.label}
      isHidden={props.enableTieredPricing === 0}
      value={props.value}
      onChange={value => props.onChange(props.field, value)}
      validationState={validationState ? 'valid' : 'invalid'}
    />
  );
}

export const BusinessPrice = props => {
  const [formState, setFormState] = useState({
    enableBusinessPricing: props.listingSettings.enableBusinessPricing ?? 0,
    enableTieredPricing: props.listingSettings.enableTieredPricing ?? 0,
    pricingLevelQuantityOne: props.listingSettings.pricingLevelQuantityOne ?? 0,
    pricingLevelQuantityTwo: props.listingSettings.pricingLevelQuantityTwo ?? 0,
    pricingLevelQuantityThree: props.listingSettings.pricingLevelQuantityThree ?? 0,
    pricingLevelQuantityFour: props.listingSettings.pricingLevelQuantityFour ?? 0,
    pricingLevelQuantityFive: props.listingSettings.pricingLevelQuantityFive ?? 0,
    pricingLevelDiscountOne: props.listingSettings.pricingLevelDiscountOne ?? 0,
    pricingLevelDiscountTwo: props.listingSettings.pricingLevelDiscountTwo ?? 0,
    pricingLevelDiscountThree: props.listingSettings.pricingLevelDiscountThree ?? 0,
    pricingLevelDiscountFour: props.listingSettings.pricingLevelDiscountFour ?? 0,
    pricingLevelDiscountFive: props.listingSettings.pricingLevelDiscountFive ?? 0,
  });

  const onChange = (field, value) => {
    setFormState(() => ({ ...formState, [field]: value }));
  };

  return (
    <View marginStart={10}>
      <Heading level={2}>(B2B) Business Price</Heading>
      <Text>Control aspects of business (B2B) pricing across the Amazon marketplace</Text>
      <Form marginTop={10} aria-labelledby="b2b-business-price">
        <ComboBox
          width="50%"
          label="Enable Business Pricing"
          items={enabledDisabled}
          selectedKey={formState.enableBusinessPricing}
          onSelectionChange={value => onChange('enableBusinessPricing', value)}
          description="Enabling will make listings active in the Amazon business market to include optional tiered pricing."
        >
          {item => <Item>{item.name}</Item>}
        </ComboBox>
        <ComboBox
          width="50%"
          label="Enable Tiered Pricing"
          items={enabledDisabled}
          selectedKey={formState.enableTieredPricing}
          onSelectionChange={value => onChange('enableTieredPricing', value)}
          description="Enabling allows the creation of tiered pricing based on quantity purchased."
          isRequired
        >
          {item => <Item>{item.name}</Item>}
        </ComboBox>
        <Flex direction="row" justify-content="align-center">
          <PriceQuantity
            label="Pricing Level One Quantity"
            field="pricingLevelQuantityOne"
            enableTieredPricing={formState.enableTieredPricing}
            value={formState.pricingLevelQuantityOne}
            onChange={onChange}
          />
          <PriceDiscount
            label="Pricing Level One Discount"
            field="pricingLevelDiscountOne"
            enableTieredPricing={formState.enableTieredPricing}
            value={formState.pricingLevelDiscountOne}
            onChange={onChange}
          />
        </Flex>
        <Flex direction="row" justify-content="align-center">
          <PriceQuantity
            label="Pricing Level Two Quantity"
            field="pricingLevelQuantityTwo"
            enableTieredPricing={formState.enableTieredPricing}
            value={formState.pricingLevelQuantityTwo}
            onChange={onChange}
          />
          <PriceDiscount
            label="Pricing Level Two Discount"
            field="pricingLevelDiscountTwo"
            enableTieredPricing={formState.enableTieredPricing}
            value={formState.pricingLevelDiscountTwo}
            onChange={onChange}
          />
        </Flex>
        <Flex direction="row" justify-content="align-center">
          <PriceQuantity
            label="Pricing Level Three Quantity"
            field="pricingLevelQuantityThree"
            enableTieredPricing={formState.enableTieredPricing}
            value={formState.pricingLevelQuantityThree}
            onChange={onChange}
          />
          <PriceDiscount
            label="Pricing Level Three Discount"
            field="pricingLevelDiscountThree"
            enableTieredPricing={formState.enableTieredPricing}
            value={formState.pricingLevelDiscountThree}
            onChange={onChange}
          />
        </Flex>
        <Flex direction="row" justify-content="align-center">
          <PriceQuantity
            label="Pricing Level Four Quantity"
            field="pricingLevelQuantityFour"
            enableTieredPricing={formState.enableTieredPricing}
            value={formState.pricingLevelQuantityFour}
            onChange={onChange}
          />
          <PriceDiscount
            label="Pricing Level Four Discount"
            field="pricingLevelDiscountFour"
            enableTieredPricing={formState.enableTieredPricing}
            value={formState.pricingLevelDiscountFour}
            onChange={onChange}
          />
        </Flex>
        <Flex direction="row" justify-content="align-center">
          <PriceQuantity
            label="Pricing Level Five Quantity"
            field="pricingLevelQuantityFive"
            enableTieredPricing={formState.enableTieredPricing}
            value={formState.pricingLevelQuantityFive}
            onChange={onChange}
          />
          <PriceDiscount
            label="Pricing Level Five Discount"
            field="pricingLevelDiscountFive"
            enableTieredPricing={formState.enableTieredPricing}
            value={formState.pricingLevelDiscountFive}
            onChange={onChange}
          />
        </Flex>
      </Form>
    </View>
  );
};
