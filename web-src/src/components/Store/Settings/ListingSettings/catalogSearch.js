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
import {
  ComboBox,
  Flex,
  Form,
  Heading,
  Item,
  ProgressCircle,
  Text,
  View,
} from '@adobe/react-spectrum';
import { genericContextualHelp } from './utils';
import { useProductsAttributes } from '../../../../hooks/useProductsAttributes';

export const CatalogSearch = props => {
  const { isLoadingProductsAttributes, commerceProductAttributes } = useProductsAttributes(props);
  const [formState, setFormState] = useState({
    amazonStandardIdentificationNumber:
      props.listingSettings.amazonStandardIdentificationNumber ?? '',
    europeanArticleNumber: props.listingSettings.europeanArticleNumber ?? '',
    globalCatalogIdentifier: props.listingSettings.globalCatalogIdentifier ?? '',
    internationalStandardBookNumber: props.listingSettings.internationalStandardBookNumber ?? '',
    universalProductCode: props.listingSettings.universalProductCode ?? '',
    generalSearch: props.listingSettings.generalSearch ?? '',
  });

  const onChange = (field, value) => {
    formState[field] = value;
    setFormState(() => ({ ...formState }));
    props.listingSettings[field] = value;
  };

  return (
    <View>
      {isLoadingProductsAttributes ? (
        <Flex alignItems="center" justifyContent="center" height="100vh">
          <ProgressCircle size="L" aria-label="Loading…" isIndeterminate />
        </Flex>
      ) : (
        <View marginStart={10}>
          <Heading level={2}>Product Listing Actions</Heading>
          <Text>Control how your product catalog interacts with the Amazon marketplace</Text>
          <Form
            marginTop={10}
            labelPosition="side"
            labelAlign="start"
            aria-labelledby="product-listing-action"
          >
            <ComboBox
              label="ASIN"
              contextualHelp={genericContextualHelp('ASIN', [
                'A unique block of 10 letters and/or numbers that identify items.',
                'ASIN stands for the Amazon Standard Identification Number. An ASIN is a unique block of 10 letters and/or numbers that identify items. For books, the ASIN is the same as the ISBN number, but for all other products a new ASIN is created when the item is uploaded to their catalog. You can find an items ASIN on the product detail page on Amazon, along with further details relating to the item.',
              ])}
              items={commerceProductAttributes}
              selectedKey={formState.amazonStandardIdentificationNumber}
              onSelectionChange={value => onChange('amazonStandardIdentificationNumber', value)}
            >
              {item => {
                if (item.default_frontend_label !== undefined) {
                  return <Item key={item.attribute_id}>{item.default_frontend_label}</Item>;
                }
              }}
            </ComboBox>
            <ComboBox
              label="EAN"
              contextualHelp={genericContextualHelp('EAN', [
                'A 12- or 13-digit product identification code. The European Article Number (EAN) is a barcode standard, a 12 or 13-digit product identification code. Each EAN uniquely identifies the product, manufacturer, and its attributes; typically, the EAN is printed on a product label or packaging as a bar code. Amazon requires EAN codes to improve quality of search results and the quality of the catalog. You can obtain EANs from the manufacturer.',
              ])}
              items={commerceProductAttributes}
              selectedKey={formState.europeanArticleNumber}
              onSelectionChange={value => onChange('europeanArticleNumber', value)}
            >
              {item => {
                if (item.default_frontend_label !== undefined) {
                  return <Item key={item.attribute_id}>{item.default_frontend_label}</Item>;
                }
              }}
            </ComboBox>
            <ComboBox
              label="GCID"
              contextualHelp={genericContextualHelp('GCID', [
                'The Global Catalog Identifier (GCID) is an ID for products that do not have a UPC code or ISBN. Amazon’s Brand Registry allows you to register as a brand owner and create a unique ID for products that may not have a UPC or ISBN.',
              ])}
              items={commerceProductAttributes}
              selectedKey={formState.globalCatalogIdentifier}
              onSelectionChange={value => onChange('globalCatalogIdentifier', value)}
            >
              {item => {
                if (item.default_frontend_label !== undefined) {
                  return <Item key={item.attribute_id}>{item.default_frontend_label}</Item>;
                }
              }}
            </ComboBox>
            <ComboBox
              label="ISBN"
              contextualHelp={genericContextualHelp('ISBN', [
                'A 10- or 13-digit unique commercial book identifier barcode. The International Standard Book Number (ISBN) is a unique commercial book identifier barcode. Each ISBN code uniquely identifies a book. An ISBN has either ten or 13 digits. All ISBN assigned after Jan 1, 2007 have 13 digits.',
              ])}
              items={commerceProductAttributes}
              selectedKey={formState.internationalStandardBookNumber}
              onSelectionChange={value => onChange('internationalStandardBookNumber', value)}
            >
              {item => {
                if (item.default_frontend_label !== undefined) {
                  return <Item key={item.attribute_id}>{item.default_frontend_label}</Item>;
                }
              }}
            </ComboBox>
            <ComboBox
              label="UPC"
              contextualHelp={genericContextualHelp('UPC', [
                'A 12-digit bar code. The Universal Product Code (UPC) is a 12-digit bar code used extensively for retail packaging in United States.',
              ])}
              items={commerceProductAttributes}
              selectedKey={formState.universalProductCode}
              onSelectionChange={value => onChange('universalProductCode', value)}
            >
              {item => {
                if (item.default_frontend_label !== undefined) {
                  return <Item key={item.attribute_id}>{item.default_frontend_label}</Item>;
                }
              }}
            </ComboBox>
            <ComboBox
              label="General Search"
              contextualHelp={genericContextualHelp('General Search', [
                'Select an attribute. This attribute is one that you can select to match Commerce products to the appropriate Amazon listing. General search uses keyword searches from your catalog. As such, it is recommended to use a Commerce attribute that carries relevant keywords, such as the product SKU or product name. General search may return many possible matches, and in such cases, you can select the appropriate Amazon listing from the possible matches. A common selection for this field is Product Name.',
              ])}
              items={commerceProductAttributes}
              selectedKey={formState.generalSearch}
              onSelectionChange={value => onChange('generalSearch', value)}
            >
              {item => {
                if (item.default_frontend_label !== undefined) {
                  return <Item key={item.attribute_id}>{item.default_frontend_label}</Item>;
                }
              }}
            </ComboBox>
          </Form>
        </View>
      )}
    </View>
  );
};
