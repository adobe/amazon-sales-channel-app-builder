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

import React, { useState } from 'react';

import {
  Button,
  ButtonGroup,
  ComboBox,
  Content,
  Dialog,
  Divider,
  Form,
  Heading,
  Switch,
  Item,
  View,
} from '@adobe/react-spectrum';
import { FormattedMessage } from 'react-intl';
import Loader from '../../Shared/Loader';
import { findCommerceAttributeMap } from '../../../hooks/useCommerceAttributeMap';

import AttributeMap = AmazonSalesChannel.Model.AttributeMap;
import CommerceProductAttribute = AmazonSalesChannel.Model.CommerceProductAttribute;

type FormAttributeMap = Pick<AttributeMap, 'id' | 'productCatalogAttributeCode' | 'status'>;
interface AddAttributesFormProps {
  commerceAttributeMap: Map<string, CommerceProductAttribute>;
  commerceProductAttributes: Array<CommerceProductAttribute>;
  isLoadingProductsAttributes: boolean;
  attribute: AttributeMap;
  onClose: () => void;
  onSave: (attribute: AttributeMap) => void;
}

export default function AddAttributesForm(props: Readonly<AddAttributesFormProps>): JSX.Element {
  const [attribute, setAttribute] = useState<Partial<FormAttributeMap>>({
    id: props.attribute.id,
    productCatalogAttributeCode: props.attribute.productCatalogAttributeCode,
    status: props.attribute.status,
  });

  const selectedAttribute = findCommerceAttributeMap(
    attribute.productCatalogAttributeCode,
    props.commerceAttributeMap,
  );
  return (
    <Dialog>
      <Heading>
        <FormattedMessage id="addAccount.header" defaultMessage="Edit Attribute Map" />
      </Heading>
      <Divider />
      <Content>
        <View>
          {props.isLoadingProductsAttributes && <Loader />}
          {!props.isLoadingProductsAttributes && (
            <Form maxWidth="size-4600" isRequired aria-labelledby="label-3">
              <ComboBox
                defaultInputValue={selectedAttribute?.label ?? ''}
                selectedKey={attribute.productCatalogAttributeCode}
                onInputChange={value => {
                  if (value === '') {
                    setAttribute({
                      ...attribute,
                      productCatalogAttributeCode: undefined,
                    });
                  }
                }}
                onSelectionChange={(attributeCode: string) => {
                  if (attributeCode) {
                    const selectedCommerceProductAttribute = findCommerceAttributeMap(
                      attributeCode,
                      props.commerceAttributeMap,
                    );

                    if (selectedCommerceProductAttribute) {
                      setAttribute({
                        ...attribute,
                        productCatalogAttributeCode: selectedCommerceProductAttribute.code,
                      });
                    }
                  } else {
                    setAttribute({
                      ...attribute,
                      productCatalogAttributeCode: undefined,
                    });
                  }
                }}
                label={
                  <FormattedMessage
                    id="app.productCatalogAttributeCode"
                    defaultMessage="Product catalog attribute code"
                  />
                }
                items={props.commerceProductAttributes}
              >
                {commerceAttribute => (
                  <Item key={commerceAttribute.code}>{commerceAttribute.label}</Item>
                )}
              </ComboBox>
              <Switch
                isSelected={attribute.status}
                onChange={status => {
                  setAttribute({
                    ...attribute,
                    status,
                  });
                }}
              >
                Enabled
              </Switch>
            </Form>
          )}
        </View>
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={props.onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          isDisabled={
            props.attribute.status === attribute.status &&
            props.attribute?.productCatalogAttributeCode === attribute?.productCatalogAttributeCode
          }
          onPress={() => {
            props.onSave({
              ...props.attribute,
              ...attribute,
            });
          }}
        >
          <FormattedMessage id="app.save" defaultMessage="Save" />
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}
