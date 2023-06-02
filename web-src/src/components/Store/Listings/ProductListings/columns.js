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

export const ID = { name: 'Id', uid: 'id' };
export const STORE_NAME = { name: 'Store Name', uid: 'storeName' };
export const COMMERCE_SKU = { name: 'Commerce SKU', uid: 'commerceSku' };
export const AMAZON_SKU = { name: 'Amazon Seller SKU', uid: 'sku' };
export const AMAZON_QUANTITY = { name: 'Amazon Quantity', uid: 'stock' };
export const ASIN = { name: 'ASIN', uid: 'asin' };
export const PRODUCT_LISTING_NAME = { name: 'Product Listing Name', uid: 'name' };
export const PRODUCT_TYPE = { name: 'Product Type', uid: 'productType' };
export const CONDITION = { name: 'Condition', uid: 'condition' };
export const LISTING_PRICE = { name: 'Listing Price', uid: 'price' };
export const SHIPPING_PRICE = { name: 'Shipping Price', uid: 'shippingPrice' };
export const LANDED_PRICE = { name: 'Landed Price', uid: 'landedPrice' };
export const STATUS = { name: 'Status', uid: 'status' };
export const MERCHANT_ID = { name: 'Merchant ID', uid: 'merchantId' };
export const ACTION = { name: 'Action', uid: 'action' };
export const BUY_BOX_WON = { name: 'Buy Box Won', uid: 'buyBoxWon' };
export const FULFILLED_BY = { name: 'Fulfilled By', uid: 'fulfilledBy' };
export const INACTIVE_REASON = {
  name: 'Inactive Reason (if provided by Amazon)',
  uid: 'inactiveReason',
};
export const CONDITION_OVERRIDE = { name: 'Condition Override', uid: 'conditionOverride' };
export const SELLER_NOTES = { name: 'Seller Notes Override', uid: 'sellerNotes' };
export const HANDLING_OVERRIDE = { name: 'Handling Override', uid: 'handlingOverride' };
export const LIST_PRICE_OVERRIDE = { name: 'List Price Override', uid: 'listPriceOverride' };
export const COMMERCE_ID = { name: 'Commerce Product Id', uid: 'commerceId' };

export const incompleteProductsColumns = [
  AMAZON_SKU,
  ASIN,
  PRODUCT_LISTING_NAME,
  CONDITION,
  LISTING_PRICE,
  LANDED_PRICE,
  AMAZON_QUANTITY,
  STATUS,
  ACTION,
];

export const readyToListProductsColumns = [
  AMAZON_SKU,
  ASIN,
  PRODUCT_LISTING_NAME,
  CONDITION,
  LISTING_PRICE,
  LANDED_PRICE,
  AMAZON_QUANTITY,
  STATUS,
  ACTION,
];

export const inactiveProductsColumns = [
  AMAZON_SKU,
  ASIN,
  PRODUCT_LISTING_NAME,
  CONDITION,
  LISTING_PRICE,
  LANDED_PRICE,
  AMAZON_QUANTITY,
  STATUS,
  INACTIVE_REASON,
  ACTION,
];

export const activeProductsColumns = [
  AMAZON_SKU,
  ASIN,
  PRODUCT_LISTING_NAME,
  CONDITION,
  LISTING_PRICE,
  LANDED_PRICE,
  AMAZON_QUANTITY,
  BUY_BOX_WON,
  STATUS,
  ACTION,
];

export const overridesProductsColumns = [
  ID,
  STORE_NAME,
  COMMERCE_SKU,
  AMAZON_SKU,
  ASIN,
  CONDITION_OVERRIDE,
  PRODUCT_LISTING_NAME,
  SELLER_NOTES,
  HANDLING_OVERRIDE,
  LIST_PRICE_OVERRIDE,
  ACTION,
];

export const ineligibleProductsColumns = [
  ID,
  STORE_NAME,
  AMAZON_SKU,
  COMMERCE_SKU,
  ASIN,
  PRODUCT_LISTING_NAME,
  PRODUCT_TYPE,
  CONDITION,
  LISTING_PRICE,
  SHIPPING_PRICE,
  LANDED_PRICE,
  AMAZON_QUANTITY,
  FULFILLED_BY,
  ACTION,
];

export const endedProductsColumns = [
  ID,
  STORE_NAME,
  COMMERCE_ID,
  AMAZON_SKU,
  COMMERCE_SKU,
  ASIN,
  PRODUCT_LISTING_NAME,
  PRODUCT_TYPE,
  CONDITION,
  LISTING_PRICE,
  SHIPPING_PRICE,
  AMAZON_QUANTITY,
  LANDED_PRICE,
  FULFILLED_BY,
  STATUS,
  ACTION,
];

export const newThirdPartyColumns = [
  AMAZON_SKU,
  ASIN,
  PRODUCT_LISTING_NAME,
  CONDITION,
  LISTING_PRICE,
  AMAZON_QUANTITY,
  STATUS,
  ACTION,
];
