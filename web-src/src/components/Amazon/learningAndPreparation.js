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

import React from 'react';
import { Heading, Link, Text, View, Flex } from '@adobe/react-spectrum';
import { FormattedMessage } from 'react-intl';

function AmazonStepOne() {
  return (
    <>
      <Heading level={4}>
        <FormattedMessage
          id="learning.stepOne.title"
          defaultMessage="1. Create an Amazon Seller Central account."
        />
      </Heading>
      <Flex direction="column">
        <Text>
          <FormattedMessage
            id="learning.stepOne.availability"
            defaultMessage="Available only to merchants selling on Amazon services for"
          />
          r&nbsp;
          <Link isQuiet>
            <a href="https://www.amazon.com/" target="_blank">
              <FormattedMessage id="countries.unitedStates" defaultMessage="United States" />
            </a>
          </Link>
          ,&nbsp;
          <Link isQuiet>
            <a href="https://www.amazon.co.uk/" target="_blank">
              <FormattedMessage id="countries.unitedKingdom" defaultMessage="United Kingdom" />
            </a>
          </Link>
          ,&nbsp;
          <Link isQuiet>
            <a href="https://www.amazon.ca/" target="_blank">
              <FormattedMessage id="countries.canada" defaultMessage="Canada" />
            </a>
          </Link>
          , and&nbsp;
          <Link isQuiet>
            <a href="https://www.amazon.com.mx/" target="_blank">
              <FormattedMessage id="countries.mexico" defaultMessage="Mexico" />
            </a>
          </Link>
          .
        </Text>
        <Link isQuiet>
          <a href="https://sellercentral.amazon.com/" target="_blank">
            <FormattedMessage
              id="learning.stepOne.createAnAmazonSellerCentralAccount"
              defaultMessage="Create Amazon Seller Central Account."
            />
          </a>
        </Link>
      </Flex>
    </>
  );
}

function AmazonStepTwo() {
  return (
    <>
      <Heading level={4}>
        <FormattedMessage
          id="learning.stepTwo.title"
          defaultMessage="2. Make sure you are an approved seller on Amazon."
        />
      </Heading>
      <Text>
        <FormattedMessage
          id="learning.stepTwo.verifyNoRestrictions"
          defaultMessage="Verify with Amazon that no restrictions exist for your products and/or categories."
        />
        &nbsp;
        <Link isQuiet>
          <a
            href="https://sellercentral.amazon.com/help/hub/reference/G200333160?locale=en-US"
            target="_blank"
          >
            <FormattedMessage id="moreInfo" defaultMessage="More info" />
          </a>
        </Link>
      </Text>
    </>
  );
}

function AmazonStepThree() {
  return (
    <>
      <Heading level={4}>
        <FormattedMessage
          id="learning.stepThree.title"
          defaultMessage="3. Configure Seller Central shipping method."
        />
      </Heading>
      <Text>
        <FormattedMessage
          id="learning.stepThree.shippingMethods"
          defaultMessage="To set up shipping methods to fulfill your Amazon orders, navigate to"
        />
        &nbsp;
        <Link isQuiet>
          <a href="https://sellercentral.amazon.com/help/hub/reference/G891" target="_blank">
            <FormattedMessage
              id="learning.stepThree.shippingSettings"
              defaultMessage="Settings &gt Shipping Settings"
            />
          </a>
        </Link>
        &nbsp;{' '}
        <FormattedMessage
          id="learning.stepThree.amazonSellerCentralAccount"
          defaultMessage="in your Amazon Seller Central account."
        />
      </Text>
    </>
  );
}

function CommerceStepOne() {
  return (
    <>
      <Heading level={4}>
        <FormattedMessage
          id="learning.commerce.stepOne.title"
          defaultMessage="1. Enable background tasks in Adobe Commerce"
        />
      </Heading>
      <Text>
        <FormattedMessage
          id="learning.commerce.stepOne.enableAdobeCommerceCron"
          defaultMessage="Enable Adobe Commerce cron. For maximum performance, set Adobe Commerce cron to run once
          every 5 minutes."
        />
        &nbsp;
        <Link isQuiet>
          <a href="https://docs.magento.com/user-guide/system/cron.html" target="_blank">
            <FormattedMessage id="moreInfo" defaultMessage="More info" />
          </a>
        </Link>
      </Text>
    </>
  );
}

function CommerceStepTwo() {
  return (
    <>
      <Heading level={4}>
        <FormattedMessage
          id="learning.commerce.stepTwo.title"
          defaultMessage="2. Increase number of automatic catalog matches."
        />
      </Heading>
      <Text>
        <FormattedMessage
          id="learning.commerce.stepTwo.attributesMatching"
          defaultMessage="Attributes help match your Adobe Commerce products to Amazon listings."
        />
        &nbsp;
        <Link isQuiet>
          <a
            href="https://experienceleague.adobe.com/docs/commerce-channels/amazon/manage/attributes/creating-attributes.html"
            target="_blank"
          >
            <FormattedMessage id="createAnAttribute" defaultMessage="Create an attribute" />
          </a>
        </Link>
        &nbsp;{' '}
        <FormattedMessage
          id="learning.commerce.stepTwo.uniqueIndentifiers"
          defaultMessage="for one or more of the following unique identifiers with their respective values:
          ASIN, UPC, EAN ISBN, GCID"
        />
      </Text>
    </>
  );
}

function CommerceStepThree() {
  return (
    <>
      <Heading level={4}>
        <FormattedMessage
          id="learning.commerce.stepThree.title"
          defaultMessage="3. If your products have more than one listing condition (e.g.: new, used, refurbished,
            etc.):"
        />
      </Heading>
      <Text>
        <Link isQuiet>
          <a
            href="https://experienceleague.adobe.com/docs/commerce-channels/amazon/manage/attributes/creating-attributes.html"
            target="_blank"
          >
            <FormattedMessage
              id="createProductAttribute"
              defaultMessage="Create a product attribute"
            />
          </a>
        </Link>
        &nbsp;
        <FormattedMessage
          id="learning.commerce.stepThree.productCondition"
          defaultMessage="that contains the product condition."
        />
      </Text>
    </>
  );
}

function CommerceStepFour() {
  return (
    <>
      <Heading level={4}>
        <FormattedMessage
          id="learning.commerce.stepFour.title"
          defaultMessage="4. If your Amazon store uses a different currency than your Adobe Commerce store:"
        />
      </Heading>
      <Text>
        <Link isQuiet>
          <a
            href="https://docs.magento.com/user-guide/configuration/general/currency-setup.html"
            target="_blank"
          >
            <FormattedMessage
              id="learning.commerce.stepFour.enableTheCurrency"
              defaultMessage="Enable the currency"
            />
          </a>
        </Link>
        &nbsp;and&nbsp;
        <Link isQuiet>
          <a href="https://docs.magento.com/user-guide/stores/currency-update.html" target="_blank">
            <FormattedMessage
              id="learning.commerce.stepFour.currencyConversionRate"
              defaultMessage="set the currency conversion rate."
            />
          </a>
        </Link>
      </Text>
    </>
  );
}

export const LearningAndPreparation = () => (
  <View>
    <Heading level={2}>
      <FormattedMessage
        id="learning.reviewTasks"
        defaultMessage="Review these tasks to assure everything will function optimally."
      />
    </Heading>
    <Heading level={3}>
      <FormattedMessage id="amazon" defaultMessage="Amazon" />
    </Heading>
    <AmazonStepOne />
    <AmazonStepTwo />
    <AmazonStepThree />
    <Heading level={3}>
      <FormattedMessage id="adobeCommerce" defaultMessage="Adobe Commerce" />
    </Heading>
    <CommerceStepOne />
    <CommerceStepTwo />
    <CommerceStepThree />
    <CommerceStepFour />
  </View>
);
