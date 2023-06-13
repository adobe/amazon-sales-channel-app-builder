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

import React, { useCallback, useMemo, useState } from 'react';
import {
  Cell,
  Column,
  DialogContainer,
  Link,
  Row,
  TableBody,
  TableHeader,
  TableView,
  View,
} from '@adobe/react-spectrum';
import { useImsContext } from '../../hooks/useImsContext';
import { useAttributeMaps } from '../../hooks/useAttributeMaps';
import Loader from '../Shared/Loader';
import { useProductsAttributes } from '../../hooks/useProductsAttributes';
import AttributesTabs from './AttributesTabs';
import { useAttributesSave } from '../../hooks/useAttributesSave';
import {
  findCommerceAttributeMap,
  useCommerceAttributeMap,
} from '../../hooks/useCommerceAttributeMap';

import AttributeMap = AmazonSalesChannel.Model.AttributeMap;
import CommerceProductAttribute = AmazonSalesChannel.Model.CommerceProductAttribute;
import { getCountryByMarketplace } from '../../../../actions-src/shared/localization/country';

type AttributeColumnSubset = Pick<
  AttributeMap,
  | 'id'
  | 'amazonAttributeName'
  | 'marketplaceId'
  | 'status'
  | 'overwriteMagentoValues'
  | 'productCatalogAttributeCode'
>;
type AttributeMapColumns = keyof AttributeColumnSubset | 'action';

const attributesColumns = [
  { name: 'Id', uid: 'id' },
  { name: 'Country', uid: 'marketplaceId' },
  { name: 'Amazon attribute name', uid: 'amazonAttributeName' },
  { name: 'Product catalog attribute code', uid: 'productCatalogAttributeCode' },
  { name: 'Overwrite Adobe Commerce values', uid: 'overwriteMagentoValues' },
  { name: 'Status', uid: 'status' },
  { name: 'Action', uid: 'action' },
];

interface AttributeFormDialogState {
  isOpen: boolean;
  formAttribute: AttributeMap | undefined;
}

interface CombinedAttribute extends AttributeMap {
  commerceAttribute?: CommerceProductAttribute;
}

export const Attributes = () => {
  const imsProps = useImsContext();
  const { commerceProductAttributes, isLoadingProductsAttributes } =
    useProductsAttributes(imsProps);
  const commerceAttributeMap = useCommerceAttributeMap(commerceProductAttributes);
  const {
    attributes,
    attributesMap,
    isLoading: isLoadingAttributes,
    setAttributes,
  } = useAttributeMaps(imsProps);

  const [{ isOpen, formAttribute }, setOpen] = useState<AttributeFormDialogState>({
    isOpen: false,
    formAttribute: undefined,
  });

  const onClose = useCallback(() => {
    setOpen({
      isOpen: false,
      formAttribute: undefined,
    });
  }, []);

  const onCreate = useCallback((attribute: AttributeMap) => {
    setOpen({
      isOpen: true,
      formAttribute: attribute,
    });
  }, []);

  const onSave = useAttributesSave(imsProps, attributesMap, onClose, setAttributes);

  const listAttributeValues = useMemo(
    () =>
      Object.values(formAttribute?.values ?? []).map(value => ({
        region: getCountryByMarketplace(formAttribute.marketplaceId)?.name,
        productSku: value.sku,
        asin: value.asin,
        amazonValue: value.amazonValue,
        status: value.status ? 'Imported' : 'Not Imported',
      })),
    [formAttribute?.values, formAttribute?.marketplaceId],
  );

  const combinedAttributes: Array<CombinedAttribute> = attributes.map(attribute => {
    const commerceAttribute = findCommerceAttributeMap(
      attribute.productCatalogAttributeCode,
      commerceAttributeMap,
    );

    return commerceAttribute
      ? {
          ...attribute,
          commerceAttribute,
        }
      : attribute;
  });

  if (isLoadingAttributes || isLoadingProductsAttributes) {
    return <Loader />;
  }

  return (
    <View margin={10}>
      <>
        <TableView flex aria-label="attributes">
          <TableHeader columns={attributesColumns}>
            {column => <Column key={column.uid}>{column.name}</Column>}
          </TableHeader>
          <TableBody items={combinedAttributes}>
            {({ commerceAttribute, ...attribute }) => (
              <Row key={attribute.id}>
                {(columnKey: AttributeMapColumns) => {
                  const key: React.Key = `${attribute.id}-${columnKey}`;
                  let content: React.ReactNode = attribute[columnKey] as React.ReactNode;

                  switch (columnKey) {
                    case 'productCatalogAttributeCode': {
                      content = commerceAttribute ? commerceAttribute.label : '';
                      break;
                    }
                    case 'overwriteMagentoValues':
                    case 'status': {
                      content = content ? 'Enabled' : 'Disabled';
                      break;
                    }
                    case 'marketplaceId': {
                      content = getCountryByMarketplace(content.toString())?.name ?? 'N/A';
                      break;
                    }
                    case 'action': {
                      content = (
                        <Link
                          onPress={() => {
                            onCreate(attribute);
                          }}
                        >
                          Edit
                        </Link>
                      );
                      break;
                    }
                    default: {
                      break;
                    }
                  }

                  return <Cell key={key}>{content}</Cell>;
                }}
              </Row>
            )}
          </TableBody>
        </TableView>
        <DialogContainer type="fullscreen" onDismiss={onClose}>
          {isOpen && (
            <>
              <AttributesTabs
                commerceProductAttributes={commerceProductAttributes}
                commerceAttributeMap={commerceAttributeMap}
                isLoadingProductsAttributes={isLoadingProductsAttributes}
                attribute={formAttribute}
                onClose={onClose}
                onSave={onSave}
                listAttributeValues={listAttributeValues}
              />
            </>
          )}
        </DialogContainer>
      </>
    </View>
  );
};
