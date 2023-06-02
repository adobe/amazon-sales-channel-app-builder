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
  TextArea,
  TextField,
  View,
} from '@adobe/react-spectrum';
import { genericContextualHelp } from './utils';
import { useProductsAttributes } from '../../../../hooks/useProductsAttributes';

export const ProductListingCondition = props => {
  const CONDITION_NOTES_MAX_LENGTH = 1000;

  const { isLoadingProductsAttributes, commerceProductAttributes } = useProductsAttributes(props);
  const [formState, setFormState] = useState({
    listProductConditionId: props.listingSettings.listProductConditionId ?? '1',
    conditionAttributeId: props.listingSettings.conditionAttributeId ?? '0',
    sellerConditionNotes: props.listingSettings.sellerConditionNotes ?? '',
    newCondition: props.listingSettings.newCondition ?? '',
    refurbishedCondition: props.listingSettings.refurbishedCondition ?? '',
    refurbishedConditionNotes: props.listingSettings.refurbishedConditionNotes ?? '',
    usedLikeNewCondition: props.listingSettings.usedLikeNewCondition ?? '',
    usedLikeNewConditionNotes: props.listingSettings.usedLikeNewConditionNotes ?? '',
    usedVeryGoodCondition: props.listingSettings.usedVeryGoodCondition ?? '',
    usedVeryGoodConditionNotes: props.listingSettings.usedVeryGoodConditionNotes ?? '',
    usedGoodCondition: props.listingSettings.usedGoodCondition ?? '',
    usedGoodConditionNotes: props.listingSettings.usedGoodConditionNotes ?? '',
    usedAcceptableCondition: props.listingSettings.usedAcceptableCondition ?? '',
    usedAcceptableConditionNotes: props.listingSettings.usedAcceptableConditionNotes ?? '',
    collectibleLikeNewCondition: props.listingSettings.collectibleLikeNewCondition ?? '',
    collectibleLikeNewConditionNotes: props.listingSettings.collectibleLikeNewConditionNotes ?? '',
    collectibleVeryGoodCondition: props.listingSettings.collectibleVeryGoodCondition ?? '',
    collectibleVeryGoodConditionNotes:
      props.listingSettings.collectibleVeryGoodConditionNotes ?? '',
    collectibleGoodCondition: props.listingSettings.collectibleGoodCondition ?? '',
    collectibleGoodConditionNotes: props.listingSettings.collectibleGoodConditionNotes ?? '',
    collectibleAcceptableCondition: props.listingSettings.collectibleAcceptableCondition ?? '',
    collectibleAcceptableConditionNotes:
      props.listingSettings.collectibleAcceptableConditionNotes ?? '',
  });

  const listProductConditionOnSelectionChange = selectedId => {
    setFormState(formState => ({
      ...formState,
      listProductConditionId: selectedId,
      sellerConditionNotes: '',
    }));
    props.listingSettings.listProductConditionId = selectedId;
  };

  const listProductCondition = [
    { id: '1', name: 'New' },
    { id: '2', name: 'Refurbished' },
    { id: '3', name: 'Used: Like New' },
    { id: '4', name: 'Used: Very Good' },
    { id: '5', name: 'Used: Good' },
    { id: '6', name: 'Used: Acceptable' },
    { id: '7', name: 'Collectible: Like New' },
    { id: '8', name: 'Collectible: Very Good' },
    { id: '9', name: 'Collectible: Good' },
    { id: '10', name: 'Collectible: Acceptable' },
    { id: '11', name: 'Assign Condition Using Product Attribute' },
  ];

  const isAssignConditionUsingProductAttribute = () => formState.listProductConditionId === '11';

  const isSellerConditionNotesHidden = () =>
    formState.listProductConditionId === '1' || isAssignConditionUsingProductAttribute();

  const isAssignConditionUsingProductAttributeDisplayed = () =>
    isAssignConditionUsingProductAttribute() && formState.conditionAttributeId !== '0';

  const onConditionAttributeSelectionChange = selectedConditionAttributeId => {
    setFormState(formState => ({
      ...formState,
      conditionAttributeId: selectedConditionAttributeId,
    }));
    props.listingSettings.conditionAttributeId = selectedConditionAttributeId;
  };

  const onSellerConditionNotesChange = selectedSellerConditionNotes => {
    setFormState(formState => ({
      ...formState,
      sellerConditionNotes: selectedSellerConditionNotes,
    }));
    props.listingSettings.sellerConditionNotes = selectedSellerConditionNotes;
  };

  const onConditionChange = (condition, selectedValue) => {
    formState[condition] = selectedValue;
    setFormState(() => ({ ...formState }));
    props.listingSettings[condition] = selectedValue;
  };

  const DisplayCondition = conditionProps => {
    const conditionDescription = `Attribute value that represents ${conditionProps.description} condition.`;
    const conditionNotesDescription = `Optional text to describe ${conditionProps.description} condition (1,000 characters maximum).`;

    return (
      <>
        <TextField
          label={`${conditionProps.label} Condition`}
          isHidden={!isAssignConditionUsingProductAttributeDisplayed()}
          description={conditionDescription}
          value={formState[conditionProps.condition]}
          onChange={value => onConditionChange(conditionProps.condition, value)}
        />
        <TextArea
          label=" "
          maxLength={CONDITION_NOTES_MAX_LENGTH}
          isHidden={!isAssignConditionUsingProductAttributeDisplayed()}
          description={conditionNotesDescription}
          value={formState[conditionProps.conditionNotes]}
          onChange={value => onConditionChange(conditionProps.conditionNotes, value)}
        />
      </>
    );
  };

  return (
    <View>
      {isLoadingProductsAttributes ? (
        <Flex alignItems="center" justifyContent="center" height="100vh">
          <ProgressCircle size="L" aria-label="Loading…" isIndeterminate />
        </Flex>
      ) : (
        <View marginStart={10}>
          <Heading level={2}>Product Listing Condition</Heading>
          <Text>Control what condition to list your products</Text>
          <Form
            marginTop={10}
            labelPosition="side"
            labelAlign="start"
            aria-labelledby="product-listing-action"
          >
            <ComboBox
              label="List Product Condition"
              contextualHelp={genericContextualHelp('List Product Condition', [
                'Select the condition of your products to list on Amazon. If you have multiple conditions, please select "Assign Condition Using Product Attribute".',
              ])}
              items={listProductCondition}
              selectedKey={formState.listProductConditionId}
              onSelectionChange={listProductConditionOnSelectionChange}
            >
              {item => <Item key={item.id}>{item.name}</Item>}
            </ComboBox>
            <TextArea
              label="Seller Condition Notes"
              maxLength={CONDITION_NOTES_MAX_LENGTH}
              isHidden={isSellerConditionNotesHidden()}
              description="Optional text to describe your condition (1,000 characters maximum)."
              value={formState.sellerConditionNotes}
              onChange={onSellerConditionNotesChange}
            />
            <ComboBox
              label="Condition Attribute"
              contextualHelp={genericContextualHelp('Seller Condition Notes', [
                'The Magento product attribute that carries a condition code used to assign the Amazon listing condition.',
              ])}
              items={commerceProductAttributes}
              isHidden={!isAssignConditionUsingProductAttribute()}
              selectedKey={formState.conditionAttributeId}
              onSelectionChange={onConditionAttributeSelectionChange}
            >
              {item => {
                if (item.default_frontend_label !== undefined) {
                  return <Item key={item.attribute_id}>{item.default_frontend_label}</Item>;
                }
              }}
            </ComboBox>
            <TextField
              label="New Condition"
              isHidden={!isAssignConditionUsingProductAttributeDisplayed()}
              description="Attribute value that represents new condition."
              value={formState.newCondition}
              onChange={value => onConditionChange('newCondition', value)}
            />
            <DisplayCondition
              label="Refurbished"
              condition="refurbishedCondition"
              conditionNotes="refurbishedConditionNotes"
              description="refurbished"
            />
            <DisplayCondition
              label="Used; Like New"
              condition="usedLikeNewCondition"
              conditionNotes="usedLikeNewConditionNotes"
              description="used; like new"
            />
            <DisplayCondition
              label="Used; Very Good"
              condition="usedVeryGoodCondition"
              conditionNotes="usedVeryGoodConditionNotes"
              description="used; very good"
            />
            <DisplayCondition
              label="Used; Good"
              condition="usedGoodCondition"
              conditionNotes="usedGoodConditionNotes"
              description="used; good"
            />
            <DisplayCondition
              label="Used; Acceptable"
              condition="usedAcceptableCondition"
              conditionNotes="usedAcceptableConditionNotes"
              description="used; acceptable"
            />
            <DisplayCondition
              label="Collectible; Like New"
              condition="collectibleLikeNewCondition"
              conditionNotes="collectibleLikeNewConditionNotes"
              description="collectible; like new"
            />
            <DisplayCondition
              label="Collectible; Very Good"
              condition="collectibleVeryGoodCondition"
              conditionNotes="collectibleVeryGoodConditionNotes"
              description="collectible; very good"
            />
            <DisplayCondition
              label="Collectible; Good"
              condition="collectibleGoodCondition"
              conditionNotes="collectibleGoodConditionNotes"
              description="collectible; good"
            />
            <DisplayCondition
              label="Collectible; Acceptable"
              condition="collectibleAcceptableCondition"
              conditionNotes="collectibleAcceptableConditionNotes"
              description="collectible; acceptable"
            />
          </Form>
        </View>
      )}
    </View>
  );
};
