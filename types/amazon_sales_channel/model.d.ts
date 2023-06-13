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

declare namespace AmazonSalesChannel {
  type ID = string;
  type ProductId = {
    storeViewId: number;
    sku: string;
  };

  namespace Model {
    interface Credentials {
      sellingPartnerAppClientId: string;
      sellingPartnerAppClientSecret: string;
      awsAccessKeyId: string;
      awsAccessKeySecret: string;
      awsSellingPartnerRole: string;
    }

    interface GetCredentialsRequest {
      accountId: string;
      encryptionKey: string;
      encryptionIv: string;
    }

    interface GetCredentialsResponse {
      credentials: Credentials;
      refreshToken: string;
    }

    type ProductCondition =
      | 'new_new'
      | 'refurbished_refurbished'
      | 'used_like_new'
      | 'used_very_good'
      | 'used_good'
      | 'used_acceptable'
      | 'collectible_like_new'
      | 'collectible_very_good'
      | 'collectible_good'
      | 'collectible_acceptable';

    const enum Status {
      ACTIVE = 'ACTIVE',
      ENDED = 'ENDED',
      INACTIVE = 'INACTIVE',
      INCOMPLETE = 'INCOMPLETE',
      INELIGIBLE = 'INELIGIBLE',
      NEW = 'NEW',
      NEW_THIRD_PARTY = 'NEW_THIRD_PARTY',
      OVERRIDE = 'OVERRIDE',
      READY_TO_LIST = 'READY_TO_LIST',
      SUBMITTED = 'SUBMITTED',
    }

    interface CommerceId {
      COMMERCE_BASE_URL: string;
      COMMERCE_CONSUMER_KEY: string;
      COMMERCE_CONSUMER_SECRET: string;
      COMMERCE_ACCESS_TOKEN: string;
      COMMERCE_ACCESS_TOKEN_SECRET: string;
    }

    interface Product {
      id?: string;
      status: string;
      price: number;
      stock: number;
      name: string;
      asin: string;
      sku: string;
      productType?: string;
      productCondition?: string;
      attributes?: Array<unknown>;
    }

    interface CatalogProductSaveAfterEvent {
      data: {
        value: {
          sku: string;
          name: string;
          asin: string;
          price: string;
          amazon_condition?: string;
          stock_data: {
            qty: string;
          };
        };
        _metadata: {
          websiteId: string;
        };
      };
    }

    interface AmazonOrder {
      AmazonOrderId: string;
      ShippingAddress: {
        AddressLine1: string;
        City: string;
        CountryCode: string;
        Phone: string;
        PostalCode: string;
        StateOrProvinceCode: string;
        StateOrRegion: string;
      };
      BuyerInfo: {
        BuyerEmail: string;
        BuyerName: string;
        Phone: string;
      };
    }

    interface AmazonOrderItem {
      SellerSKU: string;
      QuantityOrdered: number;
    }

    interface AmazonAllDataReport {
      sku: string; // seller-sku
      status: string;
      asin1: string;
      itemName: string; // item-name
    }

    interface AmazonImpReport {
      'ASIN': string;
      'Condition': string;
      'Issue Description': string;
      'Product name': string;
      'Reason': string;
      'SKU': string;
      'Status': string;
      'Status Change Date': string;
    }

    interface Account {
      id: AmazonSalesChannel.ID;
      storeName: string;
      attributeId: string;
      countryId: number;
      sellerId: string;
      emailAddress: string;
      productId: string;
      websiteName: string;
      websiteId: number;
      createdAt: Date;
      status: string;
      listingSettings: {
        enableBusinessPricing?: number;
        enableTieredPricing?: number;
        pricingLevelQuantityOne?: number;
        pricingLevelQuantityTwo?: number;
        pricingLevelQuantityThree?: number;
        pricingLevelQuantityFour?: number;
        pricingLevelQuantityFive?: number;
        pricingLevelDiscountOne?: number;
        pricingLevelDiscountTwo?: number;
        pricingLevelDiscountThree?: number;
        pricingLevelDiscountFour?: number;
        pricingLevelDiscountFive?: number;
        automaticListActionId?: number;
        listProductConditionId?: number;
      };
      orderSettings: {
        enableImportAmazonOrders?: number;
        customerCreationId?: number;
        orderNumberSourceId?: number;
        orderStatusId?: number;
        storeId?: number;
        processingOrderStatusId?: number;
      };
      integrationSettings: {
        storeName?: string;
        emailAddress?: string;
      };
      lifetimeSales: {
        amount?: number;
        lastUpdateAt?: Date;
      };
      lastUpdatedAt: Date;
    }

    type Accounts = Record<ID, Account>;

    interface ProductCounter {
      count: number;
    }

    interface AttributeValue {
      sku: string;
      asin: string;
      amazonValue: string;
      status: boolean;
    }

    type AttributeValues = Record<ID, AttributeValue>;

    interface AttributeMap {
      id?: string;
      marketplaceId: string;
      amazonAttributeName: string;
      productCatalogAttributeCode?: string;
      overwriteMagentoValues: boolean;
      status: boolean;
      values?: AttributeValues;
    }

    interface Attribute {
      value: AttributeMap;
    }

    interface CommerceProductAttribute {
      id: number;
      code: string;
      label: string;
    }

    interface CommerceWebsite {
      name: string;
      id: string;
    }

    type CountryName = 'United States' | 'Canada';

    interface CommunicationErrorLog {
      id: ID;
      sellerId: ID;
      marketplaceId: ID;
      storeName: string;
      region: CountryName;
      createdAt: Date;
      code: string;
      message: string;
    }

    interface ListingChange {
      id: ID;
      sellerId: ID;
      marketplaceId: ID;
      storeName: string;
      listingAction: string;
      region: CountryName;
      createdAt: Date;
      sellerSku: string;
      comments: string;
    }
  }
}
