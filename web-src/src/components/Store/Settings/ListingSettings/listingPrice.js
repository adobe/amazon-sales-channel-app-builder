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
import { ComboBox, Form, Heading, Item, Text, TextField, View } from '@adobe/react-spectrum';
import { enabledDisabled, genericContextualHelp } from './utils';

export const ListingPrice = props => {
  const [formState, setFormState] = useState({
    enableCurrencyConversion: props.listingSettings.enableCurrencyConversion ?? 0,
    applyVAT: props.listingSettings.applyVAT ?? 0,
    commercePriceSourceId: props.listingSettings.commercePriceSourceId ?? 1,
    amazonProductTaxCodeId: props.listingSettings.amazonProductTaxCodeId ?? 0,
    vatPercentage: props.listingSettings.vatPercentage ?? '',
    minimumAdvertisedPrice: props.listingSettings.minimumAdvertisedPrice ?? 0,
    strikeThroughPrice: props.listingSettings.strikeThroughPrice ?? 0,
    defaultPTC: props.listingSettings.defaultPTC ?? '',
  });

  const onChange = (field, value) => {
    formState[field] = value;
    setFormState(() => ({ ...formState }));
    props.listingSettings[field] = value;
  };

  const commercePriceSource = [
    { id: 1, name: 'Price' },
    { id: 2, name: 'Amazon Price' },
    { id: 3, name: 'Special Price' },
  ];

  const PTC = [
    { id: 1, name: 'Do Not Manage PTC' },
    { id: 2, name: 'Set Default PTC' },
  ];

  const isValidPercentage = useMemo(
    () =>
      !Number.isNaN(+formState.vatPercentage) &&
      formState.vatPercentage >= 0 &&
      formState.vatPercentage <= 100,
    [formState.vatPercentage],
  );

  return (
    <View marginStart={10}>
      <Heading level={2}>Listing Price</Heading>
      <Text>Control aspects of pricing across the Amazon marketplace</Text>
      <Form
        flex
        marginTop={10}
        labelPosition="side"
        labelAlign="start"
        aria-labelledby="third-party-listings"
      >
        <ComboBox
          flex
          label="Adobe Commerce Price Source"
          contextualHelp={genericContextualHelp('Adobe Commerce Price Source', [
            'Determines the price source that are used when creating your Amazon listings. The default is Price. If you choose a different attribute such as Amazon Price or Special Price, the defined value for the attribute is used for your Amazon listing. However, if selected attribute is not defined, Price is used.',
          ])}
          items={commercePriceSource}
          selectedKey={formState.commercePriceSourceId}
          isRequired
          onSelectionChange={value => onChange('commercePriceSourceId', value)}
        >
          {item => <Item>{item.name}</Item>}
        </ComboBox>
        <ComboBox
          flex
          label="Minimum Advertised Price (MAP)"
          contextualHelp={genericContextualHelp('Minimum Advertised Price (MAP)', [
            'The Commerce attribute for MAP pricing. Choosing the MAP option automatically sets your Amazon listing to the MAP price if the listing price is less than the MAP price.',
          ])}
          items={[]} // TODO check how to retrieve values
          selectedKey={formState.minimumAdvertisedPrice}
          onSelectionChange={value => onChange('minimumAdvertisedPrice', value)}
        >
          {item => <Item>{item.name}</Item>}
        </ComboBox>
        <ComboBox
          flex
          label="Strike Through Price (MSRP)"
          contextualHelp={genericContextualHelp('Strike Through Price (MSRP)', [
            'The Commerce attribute that represents the MSRP pricing. If your Amazon listing price is less than the MSRP, it displays a strike-through of the MSRP price and the listing price. This setting is also used to calculate the “You Save” amount and percentage, but this feature only applies to listings that have won the Buy Box position.',
          ])}
          items={[]} // TODO check how to retrieve values
          selectedKey={formState.strikeThroughPrice}
          onSelectionChange={value => onChange('strikeThroughPrice', value)}
        >
          {item => <Item>{item.name}</Item>}
        </ComboBox>
        <ComboBox
          flex
          label="Apply Value Added Tax (VAT)"
          contextualHelp={genericContextualHelp('Apply Value Added Tax (VAT)', '')}
          items={enabledDisabled}
          selectedKey={formState.applyVAT}
          onSelectionChange={value => onChange('applyVAT', value)}
        >
          {item => <Item>{item.name}</Item>}
        </ComboBox>
        <TextField
          contextualHelp={genericContextualHelp('VAT Percentage', [
            'Define the percentage to be used to calculate the VAT amount to be added to the listing price for your Amazon listings. If you enter 5, then a 5% VAT will be applied to the final listing price after all pricing rules have been applied. VAT tax does not apply to the final price for listings that are used within an intelligent pricing rule, unless the floor or ceiling is hit.',
          ])}
          label="VAT Percentage"
          isDisabled={formState.applyVAT === 0}
          validationState={isValidPercentage ? 'valid' : 'invalid'}
          value={formState.vatPercentage}
          onChange={value => onChange('vatPercentage', value)}
        />
        <ComboBox
          flex
          label="Amazon Product Tax Code (PTC)"
          contextualHelp={genericContextualHelp('Amazon Product Tax Code (PTC)', '')}
          items={PTC}
          selectedKey={formState.amazonProductTaxCodeId}
          isDisabled // Appears for UK Stores Only, for now we only handle USA and Canada
          onSelectionChange={value => onChange('amazonProductTaxCodeId', value)}
        >
          {item => <Item>{item.name}</Item>}
        </ComboBox>
        <TextField
          label="Default PTC" // TODO check if validation is needed on input
          isDisabled={formState.amazonProductTaxCodeId !== 2}
          value={formState.defaultPTC}
          onChange={value => onChange('defaultPTC', value)}
        />
        <ComboBox
          flex
          label="Currency Conversion"
          contextualHelp={genericContextualHelp('Currency Conversion', [
            'Allows your Commerce storefront default currency to accurately convert to your default Amazon currency to publish your listing prices in the proper currency. The currency conversion is always based on your Commerce default currency.',
            'You can still view your default Commerce and Amazon currencies when other currencies are available. If your default Commerce currency matches your default Amazon currency, leave Currency Conversion disabled.',
            'For example, if your Commerce default currency is CAD (Canadian Dollars) and your Amazon default currency is USD, you must enable Currency Conversion and choose the Conversion Rate CAD to USD. The options presented are based on the built-in Commerce currency conversions. If you do not see the option that you are looking for, set up the currency in Commerce.',
          ])}
          items={enabledDisabled}
          selectedKey={formState.enableCurrencyConversion}
          onSelectionChange={value => onChange('enableCurrencyConversion', value)}
        >
          {item => <Item>{item.name}</Item>}
        </ComboBox>
      </Form>
    </View>
  );
};
