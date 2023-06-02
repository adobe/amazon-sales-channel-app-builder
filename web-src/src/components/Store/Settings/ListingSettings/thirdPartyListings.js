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

export const ThirdPartyListings = props => {
  const importListing = 1;
  const doNotImportListing = 2;
  const [importThirdPartyListingsId, setImportThirdPartyListingsId] = useState(
    props.listingSettings.importThirdPartyListingsId ?? importListing,
  );

  const importThirdPartyListings = [
    { id: importListing, name: 'Import Listing' },
    { id: doNotImportListing, name: 'Do Not Import Listing' },
  ];

  const importThirdPartyListingsOnSelectionChange = selectedImportThirdPartyListingsId => {
    setImportThirdPartyListingsId(selectedImportThirdPartyListingsId);
    props.listingSettings.importThirdPartyListingsId = selectedImportThirdPartyListingsId;
  };

  const importThirdPartyListingsContextualHelpItems = [
    {
      key: importListing,
      value:
        'Import Listing - (Default) Choose when you want product information from your Amazon listings to import into your Commerce product catalog.',
    },
    {
      key: doNotImportListing,
      value:
        'Do Not Import Listing - Choose when you want to manually create and assign new products to your Commerce catalog for your Amazon listings.',
    },
  ];

  return (
    <View marginStart={10}>
      <Heading level={2}>Third Party Listings</Heading>
      <Text>
        Control whether to import existing listings contained within the Amazon marketplace
      </Text>
      <Form
        marginTop={10}
        labelPosition="side"
        labelAlign="start"
        aria-labelledby="third-party-listings"
      >
        <ComboBox
          flex
          label="Import Third Party Listings"
          contextualHelp={genericListContextualHelp(
            'Import Third Party Listings',
            importThirdPartyListingsContextualHelpItems,
          )}
          items={importThirdPartyListings}
          selectedKey={importThirdPartyListingsId}
          isRequired
          onSelectionChange={importThirdPartyListingsOnSelectionChange}
        >
          {item => <Item>{item.name}</Item>}
        </ComboBox>
        <ComboBox
          flex
          label="Attribute That Contains Amazon Seller SKU"
          contextualHelp={genericContextualHelp('Attribute That Contains Amazon Seller SKU', [
            'Only active when set to Import Listing.',
            'Choose the Commerce attribute as a match to the Amazon attribute for the Amazon Seller SKU. If this attribute does not exist, see Creating Amazon Product Attributes for Amazon Matching. If needed, review your Commerce attributes and create or edit an attribute to match to this Amazon data.',
          ])}
          items={[]}
          selectedKey={0}
          isDisabled={importThirdPartyListingsId === doNotImportListing}
        >
          {item => <Item>{item.name}</Item>}
        </ComboBox>
        <ComboBox
          flex
          label="Attribute That Contains Amazon ASIN"
          contextualHelp={genericContextualHelp('Attribute That Contains Amazon ASIN', [
            'Only active when set to Import Listing.',
            'Choose the Commerce attribute that matches to the Amazon attribute for the Amazon ASIN. If this attribute does not exist, see Creating Amazon Product Attributes for Amazon Matching. If needed, review your Commerce attributes and create or edit an attribute to match to this Amazon data.',
          ])}
          items={[]}
          selectedKey={0}
          isDisabled={importThirdPartyListingsId === doNotImportListing}
        >
          {item => <Item>{item.name}</Item>}
        </ComboBox>
      </Form>
    </View>
  );
};
