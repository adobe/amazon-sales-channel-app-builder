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
export const MERCHANT_ID = { name: 'Merchant Id', uid: 'sellerId' };
export const AMAZON_STORE_NAME = { name: 'Amazon Store Name', uid: 'storeName' };
export const SELLER_SKU = { name: 'Seller SKU', uid: 'sellerSku' };
export const REGION = { name: 'Region', uid: 'region' };
export const LISTING_ACTION = { name: 'Listing Action', uid: 'listingAction' };
export const COMMENTS = { name: 'Comments', uid: 'comments' };
export const CREATED_ON = { name: 'Created On', uid: 'createdAt' };
export const ERROR_CODE = { name: 'Error Code', uid: 'code' };
export const MESSAGE = { name: 'Message', uid: 'message' };

export const listingChangesLogColumns = [
  ID,
  MERCHANT_ID,
  AMAZON_STORE_NAME,
  SELLER_SKU,
  REGION,
  LISTING_ACTION,
  COMMENTS,
  CREATED_ON,
];

export const communicationErrorsLogColumns = [
  ID,
  MERCHANT_ID,
  AMAZON_STORE_NAME,
  REGION,
  ERROR_CODE,
  MESSAGE,
  CREATED_ON,
];
