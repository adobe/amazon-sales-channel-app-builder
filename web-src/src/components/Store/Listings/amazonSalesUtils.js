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

const { updateAccount } = require('../../../utils');

function getTotalAmount(amazonSales) {
  let amount = 0;
  amazonSales.forEach(sale => {
    amount += sale.totalSales.amount;
  });
  return amount;
}

function getCurrencyPercentage(amazonSales, timeFrame) {
  let percentage = 100;
  let currentSales = 0;
  let previousSales = 0;
  let count = 0;

  if (amazonSales.length === 0) {
    return '0';
  }

  amazonSales.forEach(sale => {
    if (count++ < timeFrame) previousSales += sale.totalSales.amount;
    else currentSales += sale.totalSales.amount;
  });
  if (previousSales !== 0) {
    percentage = 100 * (currentSales / previousSales - 1);
  } else if (previousSales === 0 && currentSales === 0) {
    percentage = 0;
  }

  return percentage.toFixed(2);
}

function calculateLifetimeSales(amazonSales, props) {
  const account = props.account;
  let amount = account?.lifetimeSales?.amount ?? 0;

  let lastUpdatedAt =
    account?.lifetimeSales?.lastUpdatedAt ?? new Date(amazonSales[0]?.interval.split('--')[0]);

  const today = new Date();
  let currentDayAmount = 0;

  amazonSales.forEach(sale => {
    const date = new Date(sale.interval.split('--')[1]);
    if (date > lastUpdatedAt) {
      if (date < today) {
        amount += sale.totalSales.amount;
        lastUpdatedAt = date;
      } else {
        currentDayAmount = sale.totalSales.amount;
      }
    }
  });

  account.lifetimeSales = {
    amount,
    lastUpdatedAt,
  };

  updateAccount(props, account);

  amount += currentDayAmount;
  return amount;
}

module.exports = {
  getTotalAmount,
  getCurrencyPercentage,
  calculateLifetimeSales,
};
