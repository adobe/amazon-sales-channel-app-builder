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

import { main as getAttributes } from '../../../../../actions-src/api/product/runtime/getAttributes';
import Attribute = AmazonSalesChannel.Model.Attribute;
import { Attributes } from '../../../../../actions-src/api/attribute/repository/attributeRepository';
import AttributeMap = AmazonSalesChannel.Model.AttributeMap;

type SuccessResponse = AdobeRuntime.SuccessResponse<Attributes>;

const get = jest.fn();

jest.mock('@adobe/aio-lib-state', () => ({
  esModule: true,
  init: jest.fn().mockImplementation(() => ({
    get,
  })),
}));

function mockGetAttributeKeys(attributeKeys: string[]): Promise<Attributes> {
  return Promise.resolve({ value: attributeKeys });
}

function mockGetAttribute(attribute: AttributeMap): Promise<Attribute> {
  return Promise.resolve({ value: attribute });
}

describe('api-get-attributes', () => {
  it('retrieves a collection of attributes', async () => {
    get.mockReturnValueOnce(
      mockGetAttributeKeys(['ProductSiteLaunchDate', 'ConditionType', 'MerchantShippingGroup']),
    ).mockReturnValueOnce(
      mockGetAttribute({
        id: 'uuid',
        marketplaceId: 'ASDDSA',
        amazonAttributeName: 'ProductSiteLaunchDate',
        productCatalogAttributeCode: 'launchAt',
        overwriteMagentoValues: false,
        status: true,
        values: {
          'sku1attr': {
            sku: 'SKU1',
            asin: 'asin1',
            amazonValue: '2023-05-01T00:00:00.000Z',
            status: true,
          },
          'sku2attr': {
            sku: 'SKU2',
            asin: 'asin2',
            amazonValue: '2023-05-28T00:00:00.000Z',
            status: true,
          } },
        }),
    );

    const response = await getAttributes({
      LOG_LEVEL: 'info',
    }) as SuccessResponse;

    expect(get).toHaveBeenCalledTimes(4);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
