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

import { useCallback } from 'react';
import { cloneDeep } from 'lodash';
import { callAction } from '../utils';

import AttributeMap = AmazonSalesChannel.Model.AttributeMap;
import IMSContextProps = AmazonSalesChannel.IMSContextProps;
import ErrorResponse = AmazonSalesChannel.ErrorResponse;

type Response = AttributeMap | ErrorResponse;
type MapOfAttributeMap = Map<AttributeMap['id'], AttributeMap>;

export function useAttributesSave(
  imsProps: IMSContextProps,
  attributes: MapOfAttributeMap,
  onClose: () => void,
  setAttributes: (attributes: MapOfAttributeMap) => void,
) {
  return useCallback(
    (savedAttribute: AttributeMap) => {
      async function save() {
        const result = (await callAction(imsProps, 'add-attribute-mapping', '', savedAttribute)) as
          | Response
          | ErrorResponse;

        if (!(result as ErrorResponse)?.error) {
          const attributesModified = cloneDeep(attributes);
          attributesModified.set(savedAttribute.id, result as AttributeMap);
          setAttributes(attributesModified);
          onClose();
        }
      }

      // eslint-disable-next-line no-console
      save().catch(() => console.error('Unable to save product attribute'));
    },
    [setAttributes, imsProps, onClose, attributes],
  );
}
