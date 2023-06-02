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

import { Flex, Heading, Image, Link, Text, View } from '@adobe/react-spectrum';
import { getAmazonLogoSrcPath } from '../../utils';

export const SellerCentralLinks = () => (
  <Flex direction="column">
    <Flex direction="row" marginTop={10} alignItems="center">
      <View marginEnd={20} marginStart={20}>
        <Image
          src={getAmazonLogoSrcPath()}
          height="1.8rem"
          width="1.8rem"
          min-width="4.8rem"
          alt="Amazon logo"
          UNSAFE_className="AmazonLogo"
        />
      </View>
      <Heading level={2}>Seller Central links</Heading>
    </Flex>
    <Flex direction="column" margin={20} marginTop={0} marginBottom={100} gap="size-200">
      <Flex direction="column">
        <Link isQuiet>
          <a
            href="https://sellercentral.amazon.com/sbr/ref=xx_shipset_dnav_xx#shipping_templates"
            target="_blank"
          >
            Shipping
          </a>
        </Link>
        <Text>Set up your shipping rates</Text>
      </Flex>
      <Flex direction="column">
        <Link isQuiet>
          <a href="https://sellercentral.amazon.com/tax/nexus/settings" target="_blank">
            Taxes
          </a>
        </Link>
        <Text>Edit your tax rates</Text>
      </Flex>
      <Flex direction="column">
        <Link isQuiet>
          <a
            href="https://sellercentral.amazon.com/sw/AccountInfo/DepositMethodView/step/DepositMethodView?ref_=macs_aidepvw_cont_acinfohm"
            target="_blank"
          >
            Payments
          </a>
        </Link>
        <Text>Bank account settings</Text>
      </Flex>
      <Flex direction="column">
        <Link isQuiet>
          <a
            href="https://sellercentral.amazon.com/notifications/preferences/ref=xx_notifpref_dnav_xx"
            target="_blank"
          >
            Notifications
          </a>
        </Link>
        <Text>Manage the notifications you get from Amazon</Text>
      </Flex>
      <Flex direction="column">
        <Link isQuiet>
          <a
            href="https://sellercentral.amazon.com/hz/myqdashboard/ref=xx_myqd_dnav_xx"
            target="_blank"
          >
            Category Approval
          </a>
        </Link>
        <Text>Request approval to sell in a specific category</Text>
      </Flex>
    </Flex>
  </Flex>
);
