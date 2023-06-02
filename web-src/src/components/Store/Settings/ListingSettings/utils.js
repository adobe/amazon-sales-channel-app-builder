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

import {
  Heading,
  Text,
  ContextualHelp,
  Content,
  Flex,
  ListView,
  Item,
} from '@adobe/react-spectrum';

export const genericContextualHelp = (title, paragraphs) => {
  const paragraphsText = [];
  for (const paragraph in paragraphs) {
    if (Object.hasOwn(paragraphs, paragraph)) {
      paragraphsText.push(
        <Text key={paragraph} marginTop={10}>
          {paragraphs[paragraph]}
        </Text>,
      );
    }
  }
  return (
    <ContextualHelp variant="help">
      <Heading>{title}</Heading>
      <Content>
        <Flex direction="column" justifyContent="space-between">
          {paragraphsText.map(paragraph => paragraph)}
        </Flex>
      </Content>
    </ContextualHelp>
  );
};

export const genericListContextualHelp = (title, items) => (
  <ContextualHelp variant="help">
    <Heading>{title}</Heading>
    <Content>
      <Heading level={4}>Options:</Heading>
      <ListView items={items} isQuiet overflowMode={'wrap'}>
        {item => <Item key={item.key}>{item.value}</Item>}
      </ListView>
    </Content>
  </ContextualHelp>
);

export const isValidQuantity = quantity =>
  !Number.isNaN(+quantity) && quantity >= 0 && quantity % 1 === 0;

export const enabledDisabled = [
  { id: 0, name: 'Disabled' },
  { id: 1, name: 'Enabled' },
];
