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

import { useState } from 'react';
import {
  AlertDialog,
  ComboBox,
  DialogContainer,
  Form,
  Heading,
  Item,
  Text,
  View,
} from '@adobe/react-spectrum';
import { FormattedMessage } from 'react-intl';
import { genericListContextualHelp } from './utils';

export const ProductListingActions = props => {
  const automaticallyListEligibleProducts = 1;
  const doNotAutomaticallyListEligibleProducts = 0;

  const [automaticListActionId, setAutomaticListActionId] = useState(
    props.listingSettings.automaticListActionId ?? automaticallyListEligibleProducts,
  );

  const [automaticListActionDialogAlert, setAutomaticListActionDialogAlert] = useState(false);

  const showDialog = selectedActionId => {
    if (selectedActionId === doNotAutomaticallyListEligibleProducts) {
      setAutomaticListActionDialogAlert(true);
    }
  };

  const automaticListActionOnSelectionChange = selectedActionId => {
    setAutomaticListActionId(selectedActionId);
    props.listingSettings.automaticListActionId = selectedActionId;
    showDialog(selectedActionId);
  };

  const automaticListActions = [
    {
      id: automaticallyListEligibleProducts,
      name: 'Automatically List Eligible Products',
    },
    {
      id: doNotAutomaticallyListEligibleProducts,
      name: 'Do Not Automatically List Eligible Products',
    },
  ];

  const automaticListActionContextualHelpItems = [
    {
      key: 1,
      value:
        'Automatically List Eligible Products - (Recommended) Choose when you want your Commerce catalog products (that meet Amazon’s eligibility requirements) to automatically publish to Amazon and create Amazon Listings. When chosen, the Ready to List tab is not displayed.',
    },
    {
      key: 2,
      value:
        'Do Not Automatically List Eligible Products - Choose when you want to manually select eligible Commerce catalog products and create Amazon Listings. When chosen, catalog products that meet your listing criteria and contain all required information display on the Ready to List tab for manual publishing.',
    },
  ];

  return (
    <View marginStart={10}>
      <Heading level={2}>Product Listing Actions</Heading>
      <Text>Control how your product catalog interacts with the Amazon marketplace</Text>
      <Form
        marginTop={10}
        labelPosition="side"
        labelAlign="start"
        aria-labelledby="product-listing-action"
      >
        <ComboBox
          label="Automatic List Action"
          contextualHelp={genericListContextualHelp(
            'Automatic List Action',
            automaticListActionContextualHelpItems,
          )}
          items={automaticListActions}
          selectedKey={automaticListActionId}
          isRequired
          onSelectionChange={automaticListActionOnSelectionChange}
        >
          {item => <Item>{item.name}</Item>}
        </ComboBox>
      </Form>
      <DialogContainer onDismiss={() => setAutomaticListActionDialogAlert(false)}>
        {automaticListActionDialogAlert && (
          <AlertDialog
            title={
              <FormattedMessage
                id="productListingActions.dialogAlertHeader"
                defaultMessage="Important Note"
              />
            }
            variant="warning"
            primaryActionLabel="OK"
          >
            <FormattedMessage
              id="productListingActions.dialogAlertMessage"
              defaultMessage='By selecting "Do Not Automatically List Eligible Products", all eligible products will
            simply queue up and await a user to publish on Amazon.'
            />
          </AlertDialog>
        )}
      </DialogContainer>
    </View>
  );
};
