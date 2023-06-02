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

import { Flex, Heading, Image, StatusLight, Text, View } from '@adobe/react-spectrum';
import { getFormattedDate, getImageSrcPath, getStatusLightVariant } from '../../utils';

export const StoreInfo = props => (
  <Flex direction="row" alignItems="center">
    <View marginStart={10} isHidden={props.limitedInfo}>
      <Image
        src={getImageSrcPath(props.account.countryId)}
        height="2.8rem"
        width="2.8rem"
        min-width="5.8rem"
        alt="Country image"
        UNSAFE_className="CountryFlag"
      />
    </View>
    <View marginStart={10} marginTop={10}>
      <Heading level={3} margin={0}>
        Store Name: {props.account.storeName}
      </Heading>
      <Flex direction="row" alignItems="center" margin={0} marginBottom={10}>
        <Heading level={4} margin={0}>
          Adobe Commerce website:
        </Heading>
        <Text margin={0} marginStart={5}>
          {props.account.websiteName}
        </Text>
        <Heading level={4} margin={0} marginStart={5} isHidden={props.limitedInfo}>
          Status:
        </Heading>
        <StatusLight
          variant={getStatusLightVariant(props.account.status)}
          margin={0}
          marginTop={5}
          isHidden={props.limitedInfo}
        >
          {props.account.status}
        </StatusLight>
        <Heading level={4} margin={0} marginStart={5} isHidden={props.limitedInfo}>
          Created:
        </Heading>
        <Text marginStart={5} isHidden={props.limitedInfo}>
          {getFormattedDate(props.account.createdAt)}
        </Text>
        <Heading
          level={4}
          margin={0}
          marginStart={5}
          isHidden={props.limitedInfo || !props.account.lastUpdatedAt}
        >
          Last Updated:
        </Heading>
        <Text marginStart={5} isHidden={props.limitedInfo || !props.account.lastUpdatedAt}>
          {getFormattedDate(props.account.lastUpdatedAt)}
        </Text>
      </Flex>
    </View>
  </Flex>
);
