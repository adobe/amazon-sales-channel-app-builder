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
export const MERCHANT_ID = { name: 'Merchant Id', uid: 'merchant_id' };
export const ACCOUNT_NAME = { name: 'Account Name', uid: 'account' };
export const AMAZON_SELLER_SKU = { name: 'Amazon Seller SKU', uid: 'amazonSellerSku' };
export const ASIN = { name: 'ASIN', uid: 'asin' };
export const PRODUCT_LISTING_NAME = { name: 'Product Listing Name', uid: 'name' };
export const YOUR_LANDED_PRICE = { name: 'Your Landed Price', uid: 'price' };
export const LOWEST_LANDED_PRICE = { name: 'Lowest Landed Price', uid: 'lowestLandedPrice' };
export const CONDITION_LOWEST_PRICE = {
  name: 'Condition (lowest price)',
  uid: 'conditionLowestPrice',
};
export const BUY_BOX_LANDED_PRICE = { name: 'Buy Box Landed Price', uid: 'buyBoxLandedPrice' };
export const IS_SELLER_BUY_BOX = { name: 'Is Seller (Buy Box)', uid: 'isSellerBuyBox' };
export const CONDITION_BUY_BOX = { name: 'Condition (Buy Box)', uid: 'conditionBuyBox' };
export const LISTING_ID = { name: 'Listing Id', uid: 'listing_id' };
export const COMMERCE_PRODUCT_ID = { name: 'Commerce Product Id', uid: 'commerce_product_id' };
export const ALERT_TYPE = { name: 'Alert Type', uid: 'alert_type' };
export const FIELD_NAME = { name: 'Field Name', uid: 'field_name' };
export const NOTES = { name: 'Notes', uid: 'notes' };

export const competitivePriceAnalysisColumns = [
  AMAZON_SELLER_SKU,
  ASIN,
  PRODUCT_LISTING_NAME,
  YOUR_LANDED_PRICE,
  LOWEST_LANDED_PRICE,
  CONDITION_LOWEST_PRICE,
  BUY_BOX_LANDED_PRICE,
  IS_SELLER_BUY_BOX,
  CONDITION_BUY_BOX,
];

export const listingImprovementsColumns = [AMAZON_SELLER_SKU, ASIN, ALERT_TYPE, FIELD_NAME, NOTES];
