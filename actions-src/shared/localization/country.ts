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

interface Country {
  id: number;
  code: string;
  name: string;
  marketplaceId: string;
  region: string;
  currency: string;
}

export const countries: Array<Country> = [
  {
    id: 1,
    code: 'US',
    name: 'United States',
    marketplaceId: 'ATVPDKIKX0DER',
    region: 'na',
    currency: '$',
  },
  {
    id: 2,
    code: 'CA',
    name: 'Canada',
    marketplaceId: 'A2EUQ1WTGCTBG2',
    region: 'na',
    currency: 'CAN $',
  },
];

export function getCountryById(id: number): Country | undefined {
  return countries.find(country => country.id === id);
}

export function getCountryByMarketplace(marketplaceId: string): Country | undefined {
  return countries.find(country => country.marketplaceId === marketplaceId);
}

export function getCountryByName(name: string): Country | undefined {
  return countries.find(country => country.name === name);
}
