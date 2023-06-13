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
  Button,
  ComboBox,
  Divider,
  Flex,
  Form,
  Heading,
  Item,
  ProgressCircle,
  Text,
  View,
} from '@adobe/react-spectrum';
import Back from '@spectrum-icons/workflow/Back';
import { useLocation, useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { StoreInfo } from '../storeInfo';
import { genericContextualHelp, genericListContextualHelp } from './ListingSettings/utils';
import { updateAccount } from '../../../utils';
import { useCommerceStores } from '../../../hooks/useCommerceStores';

export const OrderSettings = props => {
  const navigate = useNavigate();
  const location = useLocation();
  const account = location.state.account;

  const { isLoadingCommerceStores, stores } = useCommerceStores(props, account);

  const enabledDisabled = [
    { id: 0, name: 'Disabled' },
    { id: 1, name: 'Enabled' },
  ];

  const [isSaving, setIsSaving] = useState(false);
  const [formState, setFormState] = useState({
    enableImportAmazonOrders: account.orderSettings.enableImportAmazonOrders ?? 1,
    customerCreationId: account.orderSettings.customerCreationId ?? 1,
    orderNumberSourceId: account.orderSettings.orderNumberSourceId ?? 1,
    orderStatusId: account.orderSettings.orderStatusId ?? 1,
    storeId: account.orderSettings.storeId ?? 0,
    processingOrderStatusId: account.orderSettings.processingOrderStatusId ?? 0,
  });

  const onChange = (field, value) => {
    formState[field] = value;
    setFormState(() => ({ ...formState }));
    account.orderSettings[field] = value;
  };

  const saveOrderSettings = async () => {
    setIsSaving(true);
    await updateAccount(props, account);
    setIsSaving(false);
    navigate(-1);
  };

  const importAmazonOrdersContextualHelpItems = [
    {
      key: 1,
      value:
        'Disabled - Choose when you do not want to create corresponding orders in Commerce when new orders are received from Amazon. When chosen, all other fields on this page are disabled.',
    },
    {
      key: 2,
      value:
        'Enabled - (Default) Choose when you want to create corresponding Commerce orders when new orders are received from Amazon. Commerce orders are created based on Amazon status and stock levels.',
    },
  ];

  const customerCreationOptions = [
    { id: 1, name: 'No Customer Creation (guest)' },
    { id: 2, name: 'Build New Customer Account' },
  ];

  const customerCreationContextualHelpItems = [
    {
      key: 1,
      value:
        'No Customer Creation (guest) - (Default) Choose when you do not want to create a customer account in Commerce using the imported customer data from the Amazon order. When chosen, this option tells Commerce to process an imported Amazon order the same way it processes a guest checkout.',
    },
    {
      key: 2,
      value:
        'Build New Customer Account - Choose when you want to create a New Customer Account in your Commerce customer database using the customer data imported with the Amazon order. This option helps build your Commerce customer database from your Amazon orders.',
    },
  ];

  const orderNumberSourceOptions = [
    { id: 1, name: 'Build Using Adobe Commerce Order Number' },
    { id: 2, name: 'Build Using Amazon Order Number' },
  ];

  const orderNumberSourceContextualHelpItems = [
    {
      key: 1,
      value:
        'Build Using Adobe Commerce Order Number - (Default) Choose when you want to create a unique Commerce order number for the corresponding Amazon order using the Commerce incrementally assigned order ID.',
    },
    {
      key: 2,
      value:
        'Build Using Amazon Order Number - Choose when you want to create the Commerce order number using the corresponding Amazon-assigned order number.',
    },
  ];

  const orderStatusOptions = [
    { id: 1, name: 'Default Order Status' },
    { id: 2, name: 'Custom Order Status' },
  ];

  const orderStatusContextualHelpItems = [
    {
      key: 1,
      value:
        'Default Order Status - (Default) Choose when you want newly created orders imported from Amazon to be assigned your default order status for new orders. The default status for new orders (unless you have created a custom order status for new orders) is Pending. See Processing Orders.',
    },
    {
      key: 2,
      value:
        'Custom Order Status - Choose when you want newly created orders imported from Amazon to be assigned a status other than the default. When chosen, Processing Order Status enables for you to choose the status you want to use for newly created orders imported from Amazon.',
    },
  ];

  const processingOrderStatusOptions = [
    { key: 1, value: 'Processing', code: 'processing' },
    { key: 2, value: 'Suspected Fraud', code: 'fraud' },
    { key: 3, value: 'Pending Payment', code: 'pending_payment' },
    { key: 4, value: 'Payment Review', code: 'payment_review' },
    { key: 5, value: 'Pending', code: 'pending' },
    { key: 6, value: 'On Hold', code: 'holded' },
    { key: 7, value: 'Open', code: 'STATE_OPEN' },
    { key: 8, value: 'Complete', code: 'complete' },
    { key: 9, value: 'Closed', code: 'closed' },
    { key: 10, value: 'Canceled', code: 'canceled' },
    { key: 11, value: 'PayPal Canceled Reversal', code: 'paypay_canceled_reversal' },
    { key: 12, value: 'Pending PayPal', code: 'pending_paypal' },
    { key: 13, value: 'PayPal Reversed', code: 'paypal_reversed' },
  ];

  return (
    <View margin={10}>
      <Heading level={2}>
        <FormattedMessage id="orderSettings.title" defaultMessage="Order Settings" />
      </Heading>
      <Divider size="S" marginTop={10} />
      {isLoadingCommerceStores || isSaving ? (
        <Flex alignItems="center" justifyContent="center" height="100vh">
          <ProgressCircle size="L" aria-label="Loading…" isIndeterminate />
        </Flex>
      ) : (
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
                <Button variant={'cta'} onPress={() => saveOrderSettings()}>
                  <Text>
                    <FormattedMessage
                      id="orderSettings.save"
                      defaultMessage="Save order settings"
                    />
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
                    id="orderSettings.description"
                    defaultMessage="Control how Amazon orders are managed"
                  />
                </Text>
                <Form
                  marginTop={10}
                  labelPosition="side"
                  labelAlign="start"
                  aria-labelledby="product-listing-action"
                >
                  <ComboBox
                    label={
                      <FormattedMessage
                        id="orderSettings.enableImportAmazonOrders"
                        defaultMessage="Import Amazon Orders"
                      />
                    }
                    contextualHelp={genericListContextualHelp(
                      'Import Amazon Orders',
                      importAmazonOrdersContextualHelpItems,
                    )}
                    items={enabledDisabled}
                    selectedKey={formState.enableImportAmazonOrders}
                    isRequired
                    onSelectionChange={value => onChange('enableImportAmazonOrders', value)}
                  >
                    {item => <Item>{item.name}</Item>}
                  </ComboBox>
                  <ComboBox
                    label={
                      <FormattedMessage
                        id="orderSettings.importAmazonOrders"
                        defaultMessage="Import Amazon Orders Into Adobe Commerce Store"
                      />
                    }
                    contextualHelp={genericContextualHelp(
                      'Import Amazon Orders Into Adobe Commerce Store',
                      [],
                    )}
                    items={stores}
                    selectedKey={formState.storeId}
                    isRequired
                    isDisabled={formState.enableImportAmazonOrders === 0}
                    onSelectionChange={value => onChange('storeId', value)}
                  >
                    {item => <Item>{item.name}</Item>}
                  </ComboBox>
                  <ComboBox
                    label={
                      <FormattedMessage
                        id="orderSettings.customerCreation"
                        defaultMessage="Customer Creation"
                      />
                    }
                    contextualHelp={genericListContextualHelp(
                      'Customer Creation',
                      customerCreationContextualHelpItems,
                    )}
                    items={customerCreationOptions}
                    selectedKey={formState.customerCreationId}
                    isDisabled={formState.enableImportAmazonOrders === 0}
                    onSelectionChange={value => onChange('customerCreationId', value)}
                  >
                    {item => <Item>{item.name}</Item>}
                  </ComboBox>
                  <ComboBox
                    label={
                      <FormattedMessage
                        id="orderSettings.orderNumberSource"
                        defaultMessage="Order Number Source"
                      />
                    }
                    contextualHelp={genericListContextualHelp(
                      'Order Number Source',
                      orderNumberSourceContextualHelpItems,
                    )}
                    items={orderNumberSourceOptions}
                    selectedKey={formState.orderNumberSourceId}
                    isDisabled={formState.enableImportAmazonOrders === 0}
                    onSelectionChange={value => onChange('orderNumberSourceId', value)}
                  >
                    {item => <Item>{item.name}</Item>}
                  </ComboBox>
                  <ComboBox
                    label={
                      <FormattedMessage
                        id="orderSettings.orderStatus"
                        defaultMessage="Order Status"
                      />
                    }
                    contextualHelp={genericListContextualHelp(
                      'Order Status',
                      orderStatusContextualHelpItems,
                    )}
                    items={orderStatusOptions}
                    selectedKey={formState.orderStatusId}
                    isRequired
                    isDisabled={formState.enableImportAmazonOrders === 0}
                    onSelectionChange={value => onChange('orderStatusId', value)}
                  >
                    {item => <Item>{item.name}</Item>}
                  </ComboBox>
                  <ComboBox
                    label={
                      <FormattedMessage
                        id="orderSettings.processingOrderStatus"
                        defaultMessage="Processing Order Status"
                      />
                    }
                    items={processingOrderStatusOptions}
                    selectedKey={formState.processingOrderStatusId}
                    isRequired
                    isDisabled={formState.orderStatusId !== 2}
                    onSelectionChange={value => onChange('processingOrderStatusId', value)}
                  >
                    {item => <Item>{item.value}</Item>}
                  </ComboBox>
                </Form>
              </View>
            </Flex>
          </View>
        </View>
      )}
    </View>
  );
};

const viewUserGuide = () => {
  window.open(
    'https://experienceleague.adobe.com/docs/commerce-channels/amazon/order-settings.html',
    '_blank',
  );
};
