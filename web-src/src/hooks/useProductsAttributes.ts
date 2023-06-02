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

import { useEffect, useState } from 'react';
import { callAction } from '../utils';
import ProductAttribute = Commerce.Model.ProductAttribute;
import CommerceProductAttribute = AmazonSalesChannel.Model.CommerceProductAttribute;
import IMSContextProps = AmazonSalesChannel.IMSContextProps;

interface UseProductsAttributesHook {
  isLoadingProductsAttributes: boolean;
  commerceProductAttributes: Array<CommerceProductAttribute>;
}

interface Response {
  items: Array<ProductAttribute>;
}

export function useProductsAttributes(props: IMSContextProps): UseProductsAttributesHook {
  const [state, setState] = useState({
    commerceProductAttributes: [],
    isLoadingProductsAttributes: true,
  });

  const fetchProductAttributes = async () => {
    const commerceProductsResponse = (await callAction(
      props,
      'commerce-get-rest',
      'products/attributes?searchCriteria[filter_groups][0][filters][0][field]=attribute_code&searchCriteria[filter_groups][0][filters][0][value]=asin&searchCriteria[filter_groups][0][filters][0][condition_type]=eq',
    )) as Response;

    setState({
      isLoadingProductsAttributes: false,
      commerceProductAttributes: commerceProductsResponse.items.map(commerceProduct => ({
        id: commerceProduct.attribute_id,
        code: commerceProduct.attribute_code,
        label: commerceProduct.default_frontend_label,
      })),
    });
  };

  useEffect(() => {
    fetchProductAttributes()
      // eslint-disable-next-line no-console
      .catch(() => console.error('Unable to load Commerce Product Attributes'));
  }, []);

  return state;
}
