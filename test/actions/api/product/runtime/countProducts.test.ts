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

import { main as countProducts } from '../../../../../actions-src/api/product/runtime/countProducts';
import ProductCounter = AmazonSalesChannel.Model.ProductCounter;

type SuccessResponse =  AdobeRuntime.SuccessResponse<AmazonSalesChannel.Collection<ProductCounter>>;

const get = jest.fn();
const put = jest.fn();

jest.mock('@adobe/aio-lib-state', () => ({
        esModule: true,
        init: jest.fn().mockImplementation(() => ({
                get,
                put,
            })),
    }));

interface StateStoreResult<T> {
    value: T
}

function mockGetSkusByType(skus: Array<string>): Promise<StateStoreResult<Array<string>>> {
    return Promise.resolve({ value: skus });
}

describe('api-count-products', () => {
    it('Count the amount of products in a collection', async () => {
        get.mockReturnValueOnce(
            mockGetSkusByType([
                'SKU1', 'SKU2', 'SKU3', 'SKU4',
            ]),
        );

        const response =  await countProducts({
            sellerId: 'ABC',
            countryId: 1,
            productStatus: 'incomplete',
            LOG_LEVEL: 'info',
        }) as SuccessResponse;

        expect(get).toHaveBeenCalledTimes(1);
        expect(response.statusCode).toBe(200);
        expect(response.body.count).toBe(4);
    });
});
