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

import {
  filterByStatus,
  normaliseMatchedProduct,
} from '../../../../../../../web-src/src/components/Store/Listings/utils/productMapping';

const COMMERCE_PRODUCT = {
  attributeSetId: 4,
  createdAt: '2022-11-04 16:46:57',
  customAttributes: [
    { attribute_code: 'image', value: '/4/1/41h4wnuctkl.jpeg' },
    {
      attribute_code: 'url_key',
      value: 'iwako-lucky-cat-pencil-top-blue-japanese-eraser-from-japan',
    },
    { attribute_code: 'page_layout', value: 'product-full-width' },
    { attribute_code: 'gift_message_available', value: '2' },
    { attribute_code: 'small_image', value: '/4/1/41h4wnuctkl.jpeg' },
    {
      attribute_code: 'meta_title',
      value: 'iwako Lucky Cat Pencil Top Blue Japanese Eraser from Japan',
    },
    { attribute_code: 'options_container', value: 'container2' },
    { attribute_code: 'gift_wrapping_available', value: '2' },
    { attribute_code: 'thumbnail', value: '/4/1/41h4wnuctkl.jpeg' },
    {
      attribute_code: 'meta_keyword',
      value: 'iwako Lucky Cat Pencil Top Blue Japanese Eraser from Japan',
    },
  ],
  extensionAttributes: {
    category_links: [
      { category_id: '2', position: -1 },
      { category_id: '3', position: -1 },
    ],
    website_ids: [1],
  },
  id: 9,
  mediaGalleryEntries: {},
  name: 'COMMERCE_PRODUCT',
  options: [],
  price: 0.73,
  productLinks: [],
  sku: 'SKU',
  status: 1,
  tierPrices: [],
  typeId: 'simple',
  updatedAt: '2023-01-16 10:18:19',
  visibility: 2,
};

const AMAZON_PRODUCT = {
  addDelete: '',
  asin1: 'ASIN',
  asin2: '',
  asin3: '',
  bidForFeaturedPlacement: '',
  expeditedShipping: '',
  fulfillmentChannel: 'DEFAULT',
  imageUrl: '',
  itemCondition: '11',
  itemDescription: '',
  itemIsMarketplace: 'y',
  itemName: 'AMAZON_PRODUCT_NAME',
  itemNote: '',
  listingId: '0802ZYJBHIE',
  merchantShippingGroup: 'Migrated Template',
  openDate: '2022-08-02 10:05:22 PDT',
  pendingQuantity: '0',
  price: '0.8',
  productId: 'B01HSG9VK8',
  productIdType: '1',
  quantity: '0',
  sellerSku: 'SKU',
  status: 'Inactive',
  willShipInternationally: '',
  zshopBoldface: '',
  zshopBrowsePath: '',
  zshopCategory1: '',
  zshopShippingFee: '',
  zshopStorefrontFeature: '',
};

describe('productMapping/normaliseMatchedProduct', () => {
  it('should combine the commerceProduct and amazonProduct', () => {
    const normalisedMatchedProduct = normaliseMatchedProduct(COMMERCE_PRODUCT, AMAZON_PRODUCT);

    expect(normalisedMatchedProduct).toStrictEqual({
      ...COMMERCE_PRODUCT,
      amazonQuantity: '0',
      asin: 'ASIN',
      condition: '11',
      fulfilledBy: 'DEFAULT',
      landingPrice: '0.8',
      listingPrice: '0.8',
      productListingName: 'AMAZON_PRODUCT_NAME',
      productType: '1',
      shippingPrice: '0.00',
      status: 'Inactive',
    });
  });
});

describe('productMapping/filterByStatus', () => {
  it('should filter the collection with predicate', () => {
    const list = [{ ...COMMERCE_PRODUCT, status: 'Inactive' }];
    const inactive = list.filter(filterByStatus('Inactive'));
    const active = list.filter(filterByStatus('Active'));

    expect(inactive.length).toBe(1);
    expect(active.length).toBe(0);
  });
});
