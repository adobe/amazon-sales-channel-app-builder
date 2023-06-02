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

const utils = require('../../../../../../web-src/src/components/Store/Listings/amazonSalesUtils.js');

describe('getCurrencyPercentage utils test', () => {
  const currentSales1 = Array.from({ length: 30 })
    .fill()
    .map((_, i) => ({ totalSales: { amount: 1 } }));
  const previousSales1 = Array.from({ length: 30 })
    .fill()
    .map((_, i) => ({ totalSales: { amount: 2 } }));
  const amazonSales1 = [...previousSales1, ...currentSales1];

  test('Sales dropped to half compared to previous month, currency percentage should be -50%', () => {
    expect(utils.getCurrencyPercentage(amazonSales1, 30)).toEqual('-50.00');
  });

  const currentSales2 = Array.from({ length: 30 })
    .fill()
    .map((_, i) => ({ totalSales: { amount: 2 } }));
  const previousSales2 = Array.from({ length: 30 })
    .fill()
    .map((_, i) => ({ totalSales: { amount: 1 } }));
  const amazonSales2 = [...previousSales2, ...currentSales2];

  test('Sales doubled compared o previous month, currency percentage should be 100%', () => {
    expect(utils.getCurrencyPercentage(amazonSales2, 30)).toEqual('100.00');
  });

  const currentSales3 = Array.from({ length: 30 })
    .fill()
    .map((_, i) => ({ totalSales: { amount: 1 } }));
  const previousSales3 = Array.from({ length: 30 })
    .fill()
    .map((_, i) => ({ totalSales: { amount: 1 } }));
  const amazonSales3 = [...previousSales3, ...currentSales3];

  test('Sales were the same as in the previous month, currency percentage should be 0%', () => {
    expect(utils.getCurrencyPercentage(amazonSales3, 30)).toEqual('0.00');
  });

  const currentSales4 = Array.from({ length: 30 })
    .fill()
    .map((_, i) => ({ totalSales: { amount: 0 } }));
  const previousSales4 = Array.from({ length: 30 })
    .fill()
    .map((_, i) => ({ totalSales: { amount: 2 } }));
  const amazonSales4 = [...previousSales4, ...currentSales4];

  test('There were sales in the previous month but none in the current month , currency percentage should be -100%', () => {
    expect(utils.getCurrencyPercentage(amazonSales4, 30)).toEqual('-100.00');
  });

  const currentSales5 = Array.from({ length: 30 })
    .fill()
    .map((_, i) => ({ totalSales: { amount: 2 } }));
  const previousSales5 = Array.from({ length: 30 })
    .fill()
    .map((_, i) => ({ totalSales: { amount: 0 } }));
  const amazonSales5 = [...previousSales5, ...currentSales5];

  test('There were no sales in the previous month but there were sales in the current month , currency percentage should be 100%', () => {
    expect(utils.getCurrencyPercentage(amazonSales5, 30)).toEqual('100.00');
  });

  test('Received empty sales array , currency percentage should be 0%', () => {
    expect(utils.getCurrencyPercentage([], 30)).toEqual('0');
  });
});

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  }),
);

describe('calculateLifetimeSales utils test', () => {
  const props1 = {
    account: { lifetimeSales: { amount: 0, lastUpdatedAt: new Date('2023-02-10T00:00Z') } },
    ims: { org: '123' },
  };
  const amazonSales1 = [];

  test('The lifetimeSales should be 0 the first time', () => {
    expect(utils.calculateLifetimeSales(amazonSales1, props1)).toEqual(0);
  });

  const props2 = {
    account: { lifetimeSales: { amount: 0, lastUpdatedAt: new Date('2023-02-10T00:00Z') } },
    ims: { org: '123' },
  };
  const amazonSales2 = [
    { interval: '2023-02-12T00:00Z--2023-02-13T00:00Z', totalSales: { amount: 7 } },
    { interval: '2023-02-13T00:00Z--2023-02-14T00:00Z', totalSales: { amount: 15 } },
  ];

  test('The lifetimeSales should be the sum of all total sales amount from Amazon', () => {
    expect(utils.calculateLifetimeSales(amazonSales2, props2)).toEqual(22);
  });

  const props3 = {
    account: { lifetimeSales: { amount: 0, lastUpdatedAt: new Date('2023-02-13T00:00Z') } },
    ims: { org: '123' },
  };
  const amazonSales3 = [
    { interval: '2023-02-12T00:00Z--2023-02-13T00:00Z', totalSales: { amount: 7 } },
    { interval: '2023-02-13T00:00Z--2023-02-14T00:00Z', totalSales: { amount: 15 } },
  ];

  test('The lifetimeSales should add all dates after the lastUpdatedAt date', () => {
    expect(utils.calculateLifetimeSales(amazonSales3, props3)).toEqual(15);
  });
});
