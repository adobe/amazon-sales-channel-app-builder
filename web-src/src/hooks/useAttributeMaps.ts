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

import { useCallback, useEffect, useState } from 'react';
import { callAction } from '../utils';

import IMSContextProps = AmazonSalesChannel.IMSContextProps;
import AttributeMap = AmazonSalesChannel.Model.AttributeMap;
import ErrorResponse = AmazonSalesChannel.ErrorResponse;

type MapOfAttributeMap = Map<AttributeMap['id'], AttributeMap>;

interface UseAttributesHook {
  attributesMap: MapOfAttributeMap;
  attributes: Array<AttributeMap>;
  isLoading: boolean;
  setAttributes: (attributes: MapOfAttributeMap) => void;
}

function attributesMapAsMap(attributesMap: Array<AttributeMap>): MapOfAttributeMap {
  return new Map(attributesMap.map(attributeMap => [attributeMap.id, attributeMap]));
}

export function useAttributeMaps(props: IMSContextProps): UseAttributesHook {
  const [state, setState] = useState<
    Pick<UseAttributesHook, 'attributesMap' | 'attributes' | 'isLoading'>
  >({
    attributesMap: new Map(),
    attributes: [],
    isLoading: true,
  });

  const setAttributes = useCallback((attributesMap: MapOfAttributeMap) => {
    const attributes: Array<AttributeMap> = [];
    attributesMap.forEach(attributeMap => {
      attributes.push(attributeMap);
    });

    setState({
      attributesMap,
      attributes,
      isLoading: false,
    });
  }, []);

  useEffect(() => {
    async function getAttributes() {
      const response = (await callAction(props, 'api-get-attributes', '')) as
        | ErrorResponse
        | Array<AttributeMap>;

      if ((response as ErrorResponse)?.error) {
        setState({
          ...state,
          isLoading: false,
        });
      } else {
        const attributes = response as Array<AttributeMap>;
        setState({
          attributesMap: attributesMapAsMap(attributes),
          attributes,
          isLoading: false,
        });
      }
    }
    // eslint-disable-next-line no-console
    getAttributes().catch(() => console.error('Unable to load the Attribute Maps'));
  }, [props]);

  return {
    ...state,
    setAttributes,
  };
}
