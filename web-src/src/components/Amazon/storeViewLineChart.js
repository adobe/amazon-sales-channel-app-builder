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

import { VegaLite } from 'react-vega';

export const StoreViewLineChart = props => {
  const chartSpec = {
    width: 'container',
    height: 100,
    mark: 'line',
    data: { name: 'valuePerDay' },
    encoding: {
      x: { field: 'day' },
      y: { field: 'amount' },
    },
    legend: {
      display: false,
    },
    config: {
      axis: {
        disable: true,
      },
      view: {
        stroke: 'transparent',
      },
    },
  };

  const getChartData = () => {
    const valuesPerDay = [];
    let dayCount = 1;
    props.amazonSales.forEach(sale => {
      valuesPerDay.push({ day: dayCount++, amount: sale.totalSales.amount });
    });
    return {
      valuePerDay: valuesPerDay,
    };
  };

  return <VegaLite spec={chartSpec} data={getChartData()} actions={false} />;
};
