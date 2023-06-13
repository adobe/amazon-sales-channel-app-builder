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

import { mapAddress } from '../../../../../../actions-src/amazon/order/runtime/scheduled/syncOrders';
import AmazonOrder = AmazonSalesChannel.Model.AmazonOrder;

describe('mapAddress', () => {
  it('should return a mapped address object', () => {
    const amazonOrder: AmazonOrder = {
      AmazonOrderId: '123',
      ShippingAddress: {
        StateOrRegion: 'Texas',
        StateOrProvinceCode: 'CA',
        CountryCode: 'US',
        AddressLine1: '123 Main St',
        PostalCode: '12345',
        City: 'Austin',
        Phone: '666666666666',
      },
      BuyerInfo: {
        BuyerName: 'John Doe',
        BuyerEmail: 'john.doe@example.com',
        Phone: '666666666666',
      },
    };

    const mappedAddress = mapAddress(amazonOrder);
    expect(mappedAddress).toEqual({
      region: 'Texas',
      region_id: 'CA',
      region_code: 'CA',
      country_id: 'US',
      street: ['123 Main St'],
      postcode: '12345',
      city: 'Austin',
      firstname: 'John Doe',
      lastname: 'John Doe',
      email: 'john.doe@example.com',
      telephone: '666666666666',
    });
  });
});
