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
  Button,
  ButtonGroup,
  Content,
  DialogTrigger,
  Dialog,
  Link,
  Divider,
  Form,
  Heading,
  Text,
  TextField,
  View,
  Flex,
  ProgressCircle,
} from '@adobe/react-spectrum';

import { FormattedMessage } from 'react-intl';
import { useMemo, useState } from 'react';
import { updateAccount } from '../../../utils';
import { isValidEmail } from '../../../validator';
import { genericContextualHelp } from './ListingSettings/utils';

export const IntegrationSettings = props => {
  const account = props.account;

  const [emailAddress, setEmailAddress] = useState(
    account?.integrationSettings?.emailAddress || '',
  );
  const [storeName, setStoreName] = useState(account?.integrationSettings?.storeName || '');
  const [isLoading, setIsLoading] = useState(false);

  function isSaveButtonDisabled() {
    return !storeName || !validEmail;
  }

  async function saveSettings(close) {
    setIsLoading(true);
    account.integrationSettings = { storeName, emailAddress };
    await updateAccount(props, account);
    setIsLoading(false);
    close();
  }

  const validEmail = useMemo(() => isValidEmail(emailAddress), [emailAddress]);

  return (
    <DialogTrigger>
      <Link isQuiet>Store integration settings</Link>
      {close => (
        <Dialog>
          <Heading>
            <FormattedMessage
              id="integrationSettings.header"
              defaultMessage="Manage Amazon store settings"
            />
          </Heading>
          <Divider />
          <Content>
            <View>
              <Text>
                <FormattedMessage
                  id="integrationSettings.connectMessage"
                  defaultMessage="Connect your Amazon store to your Adobe Commerce store to create a single source for your catalog."
                />
              </Text>
              {isLoading ? (
                <Flex alignItems="center" justifyContent="center" height="20vh">
                  <ProgressCircle size="L" aria-label="Loading…" isIndeterminate />
                </Flex>
              ) : (
                <Form maxWidth="size-4600" isRequired aria-labelledby="label-3">
                  <TextField
                    value={emailAddress}
                    onChange={setEmailAddress}
                    validationState={validEmail ? 'valid' : 'invalid'}
                    label={<FormattedMessage id="app.email" defaultMessage="Email Address" />}
                    type="email"
                    necessityIndicator="icon"
                    contextualHelp={genericContextualHelp('', [
                      'Please enter an email where you can be contacted in case there are problems with your setup process.',
                      <a
                        href="https://experienceleague.adobe.com/docs/commerce-channels/amazon/onboarding/store-integration.html"
                        rel="noreferrer"
                        target="_blank"
                      >
                        {' '}
                        Read more in the info guide{' '}
                      </a>,
                    ])}
                  />
                  <TextField
                    value={storeName}
                    onChange={setStoreName}
                    label={
                      <FormattedMessage
                        id="integrationSettings.storeName"
                        defaultMessage="New Store Name"
                      />
                    }
                    necessityIndicator="icon"
                    contextualHelp={genericContextualHelp('', [
                      'A unique name to describe this Amazon store for internal reference only.',
                      <a
                        href="https://experienceleague.adobe.com/docs/commerce-channels/amazon/onboarding/store-integration.html"
                        rel="noreferrer"
                        target="_blank"
                      >
                        {' '}
                        Read more in the info guide{' '}
                      </a>,
                    ])}
                  />
                </Form>
              )}
            </View>
          </Content>
          <ButtonGroup>
            <Button variant="secondary" onPress={close}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              isDisabled={isSaveButtonDisabled()}
              onPress={saveSettings.bind(this, close)}
            >
              <FormattedMessage id="app.save" defaultMessage="Save" />
            </Button>
          </ButtonGroup>
        </Dialog>
      )}
    </DialogTrigger>
  );
};
