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

import { main as getProducts } from '../../../../../actions-src/api/product/runtime/getProducts';
import Product = AmazonSalesChannel.Model.Product;

type SuccessResponse =  AdobeRuntime.SuccessResponse<AmazonSalesChannel.Collection<Product>>;

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
function mockGetProduct(product: Product): Promise<StateStoreResult<Product>> {
    return Promise.resolve({ value: product });
}

describe('api-get-products', () => {
    it('retrieves a collection with a single product', async () => {
        get.mockReturnValueOnce(
            mockGetSkusByType([
                'SKU1',
            ]),
        ).mockReturnValueOnce(
            mockGetProduct({
                asin: 'SKU1',
                sku: 'SKU1',
                status: 'incomplete',
                price: 10,
                stock: 1,
                name: 'SKU1',
                productType: 'ERASER',
                attributes: [],
            }),
        );

        const response =  await getProducts({
            sellerId: 'ABC',
            countryId: 1,
            productStatus: 'incomplete',
            LOG_LEVEL: 'info',
        }) as SuccessResponse;

        expect(get).toHaveBeenCalledTimes(2);
        expect(response.statusCode).toBe(200);
        expect(response.body.total).toBe(1);
        expect(response.body.pagination).toStrictEqual({
            currentPage: 1,
            lastPage: 1,
        });
    });

    it('paginates a collection', async () => {
        const skus = Array.from({ length: 250 }, (id
        : number, idx) => (`SKU${idx + 1}`));
        get.mockReturnValueOnce(
            mockGetSkusByType(skus),
        );

        skus.slice(0, 20).forEach((sku) => {
            get.mockReturnValueOnce(
                mockGetProduct({
                    asin: sku,
                    sku,
                    status: 'incomplete',
                    price: 10,
                    stock: 1,
                    name: sku,
                    productType: 'ERASER',
                    attributes: [],
                }),
            );
        });

        const response =  await getProducts({
            sellerId: 'ABC',
            countryId: 1,
            productStatus: 'incomplete',
            LOG_LEVEL: 'info',
        }) as SuccessResponse;

        expect(get).toHaveBeenCalledTimes(251);
        expect(response.statusCode).toBe(200);
        expect(response.body.total).toBe(20);
        expect(response.body.pagination).toStrictEqual({
            currentPage: 1,
            lastPage: 1,
        });
    });

});
