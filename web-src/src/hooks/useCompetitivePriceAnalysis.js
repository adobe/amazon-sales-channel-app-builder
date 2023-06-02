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

export const useCompetitivePriceAnalysis = (
  props,
  commerceProducts,
  currentPage,
  PRODUCTS_PER_PAGE,
  account,
) => {
  const PAGED_PRODUCTS_KEY = 'pagedProducts';
  const ONE_MINUTE_TTL = 60;
  const [amazonCompetitivePriceAnalysis, setAmazonCompetitivePriceAnalysis] = useState([]);
  const [amazonListingOffers, setAmazonListingOffers] = useState([]);
  const [isLoadingCompetitivePrices, setIsLoadingCompetitivePrices] = useState(true);
  const slicedProducts = commerceProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );
  const skus = slicedProducts.map(product => product.sku);
  const [pagedProducts, setPagedProducts] = useState([]);

  const fetchAmazonCompetitivePrices = async () => {
    setIsLoadingCompetitivePrices(true);

    if (skus.length === 0) {
      return;
    }

    const responseCompetitivePrices = await callAction(props, 'get-competitive-prices-batch', '', {
      skus,
      account,
    });

    const latestAmazonCompetitivePriceAnalysis = responseCompetitivePrices.reduce((prev, item) => {
      const sellerSKU = item?.SellerSKU;
      if (sellerSKU) {
        return {
          ...prev,
          [sellerSKU]: item.Product ?? {},
        };
      }
      return { ...prev };
    }, {});
    setAmazonCompetitivePriceAnalysis({
      ...amazonCompetitivePriceAnalysis,
      ...latestAmazonCompetitivePriceAnalysis,
    });

    const responseListingOffers = await callAction(props, 'get-listing-offers-batch', '', {
      skus,
      account,
    });

    const latestAmazonListingOffers = responseListingOffers.reduce((prev, item) => {
      const sellerSKU = item?.body?.payload?.Identifier?.SellerSKU;
      if (sellerSKU) {
        return {
          ...prev,
          [sellerSKU]: item.body?.payload ?? {},
        };
      }
      return { ...prev };
    }, {});
    setAmazonListingOffers({
      ...amazonListingOffers,
      ...latestAmazonListingOffers,
    });
  };

  async function getStorageItems() {
    return await callAction(props, 'api-get-cache', '', {
      account,
      key: `${PAGED_PRODUCTS_KEY}_${currentPage}`,
    });
  }

  async function setItemsInCacheWithExpiry(mappedProducts) {
    await callAction(props, 'api-set-cache', '', {
      account,
      key: `${PAGED_PRODUCTS_KEY}_${currentPage}`,
      value: mappedProducts,
      ttl: ONE_MINUTE_TTL,
    });
  }

  useEffect(() => {
    getStorageItems()
      .then(storageItems => {
        if (storageItems?.length === 0) {
          fetchAmazonCompetitivePrices()
            .then(async () => {
              setIsLoadingCompetitivePrices(false);
              const mappedProducts = slicedProducts.map(slicedProduct => {
                const amazonPriceAnalysis = amazonCompetitivePriceAnalysis[slicedProduct.sku];
                const lowestLandedPriceAmount =
                  amazonListingOffers[slicedProduct.sku]?.Offers[0]?.ListingPrice?.Amount;
                const buyBoxLandedPriceAmount =
                  amazonPriceAnalysis?.CompetitivePricing?.CompetitivePrices[0]?.Price?.LandedPrice
                    ?.Amount;
                const formatter = new Intl.NumberFormat(undefined, {
                  style: 'currency',
                  currency:
                    amazonPriceAnalysis?.CompetitivePricing?.CompetitivePrices[0]?.Price
                      ?.LandedPrice?.CurrencyCode ?? 'USD',
                });
                return {
                  ...slicedProduct,
                  price: formatter.format(slicedProduct.price),
                  amazonSellerSku: amazonPriceAnalysis?.Identifiers?.SKUIdentifier?.SellerSKU,
                  asin: amazonPriceAnalysis?.Identifiers?.MarketplaceASIN?.ASIN,
                  lowestLandedPrice: lowestLandedPriceAmount
                    ? formatter.format(lowestLandedPriceAmount)
                    : '',
                  conditionLowestPrice: amazonListingOffers[slicedProduct.sku]?.ItemCondition,
                  buyBoxLandedPrice: buyBoxLandedPriceAmount
                    ? formatter.format(buyBoxLandedPriceAmount)
                    : '',
                  isSellerBuyBox: getIsSellerBuyBox(
                    amazonPriceAnalysis?.CompetitivePricing?.CompetitivePrices[0]
                      ?.belongsToRequester,
                  ),
                  conditionBuyBox:
                    amazonPriceAnalysis?.CompetitivePricing?.CompetitivePrices[0]?.condition,
                };
              });
              setPagedProducts(mappedProducts);
              if (mappedProducts?.length > 0) {
                await setItemsInCacheWithExpiry(mappedProducts);
              }
            })
            .catch(() => {});
        } else {
          setIsLoadingCompetitivePrices(false);
          setPagedProducts(storageItems);
        }
      })
      .catch(() => {});
  }, [commerceProducts, currentPage]);

  return { isLoadingCompetitivePrices, pagedProducts };
};

function getIsSellerBuyBox(belongsToRequester) {
  if (belongsToRequester) {
    return 'Yes';
  }
  if (belongsToRequester !== undefined) {
    return 'No';
  }
}
