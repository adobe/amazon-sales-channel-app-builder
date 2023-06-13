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

import { Button, Divider, Flex, Heading, Text, View } from '@adobe/react-spectrum';
import Back from '@spectrum-icons/workflow/Back';
import { FormattedMessage } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import { StoreInfo } from '../storeInfo';

export const ListingRules = props => {
  const navigate = useNavigate();
  const location = useLocation();
  const account = location.state.account;

  return (
    <View margin={10}>
      <Heading level={2}>
        <FormattedMessage id="listingRules.title" defaultMessage="Listing Rules" />
      </Heading>
      <Divider size="S" marginTop={10} />
      <View>
        <View backgroundColor="gray-200">
          <Flex direction="row" alignItems="center" justifyContent="space-between">
            <StoreInfo account={account} limitedInfo={true} />
            <View margin={10}>
              <Button variant={'primary'} onPress={() => navigate(-1)} isQuiet>
                <Back />
                <Text>
                  <FormattedMessage id="app.back" defaultMessage="Back" />
                </Text>
              </Button>
              <Button variant={'cta'}>
                <Text>
                  <FormattedMessage id="listingRules.view" defaultMessage="Preview changes" />
                </Text>
              </Button>
            </View>
          </Flex>
        </View>
        <View margin={10}>
          <Flex direction="column" justifyContent="space-between">
            <Flex justifyContent="right">
              <Button variant={'secondary'} onPress={() => viewUserGuide()}>
                <Text>
                  <FormattedMessage id="app.viewUserGuide" defaultMessage="View User Guide" />
                </Text>
              </Button>
            </Flex>
            <View marginStart={10}>
              <Text>
                <FormattedMessage
                  id="listingRules.description"
                  defaultMessage="Determines what catalog products are eligible to be listed on Amazon"
                />
              </Text>
            </View>
            <Heading level={2} marginTop={60}>
              <FormattedMessage
                id="listingRules.info"
                defaultMessage="Listing Rule Conditions (don't add conditions if all products are eligible for this Amazon marketplace)."
              />
            </Heading>
            <Divider size="M" />
            LISTING RULES
            <Divider size="M" />
          </Flex>
        </View>
      </View>
    </View>
  );
};

const viewUserGuide = () => {
  window.open(
    'https://experienceleague.adobe.com/docs/commerce-channels/amazon/rules/listing-rules.html',
    '_blank',
  );
};
