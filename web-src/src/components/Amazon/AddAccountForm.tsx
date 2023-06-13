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

import React, { useState, useEffect, useMemo } from 'react';
import {
  Divider,
  Flex,
  Form,
  Heading,
  ProgressCircle,
  Text,
  TextField,
  View,
  ComboBox,
  Button,
  Dialog,
  Content,
  ButtonGroup,
  DialogTrigger,
} from '@adobe/react-spectrum';
import { Item } from '@react-spectrum/list';
import { v4 as uuidV4 } from 'uuid';
import { FormattedMessage } from 'react-intl';
import { callAction } from '../../utils';
import { isValidEmail } from '../../validator';
import { useCommerceWebsites } from '../../hooks/useCommerceWebsites';
import { useProductsAttributes } from '../../hooks/useProductsAttributes';
import { useImsContext } from '../../hooks/useImsContext';
import { countries, getCountryByName } from '../../../../actions-src/shared/localization/country';
import CommerceWebsite = AmazonSalesChannel.Model.CommerceWebsite;
import CommerceProductAttribute = AmazonSalesChannel.Model.CommerceProductAttribute;

export function AccountsAddForm(props: {}): JSX.Element {
  const imsProps = useImsContext();

  const { isLoadingProductsAttributes, commerceProductAttributes } =
    useProductsAttributes(imsProps);

  const [isLoading, setIsLoading] = useState(false);
  const { isLoadingCommerceWebsites, commerceWebsites } = useCommerceWebsites(imsProps);
  const [websiteName, setWebsiteName] = useState('');
  const [websiteId, setWebsiteId] = useState('');
  const [countryName, setCountryName] = useState('');
  const [attributeName, setAttributeName] = useState('');
  const [productId, setProductId] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [storeName, setStoreName] = useState('');
  const [sellerId, setSellerId] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [sellingPartnerAppClientId, setSellingPartnerAppClientId] = useState('');
  const [sellingPartnerAppClientSecret, setSellingPartnerAppClientSecret] = useState('');
  const [awsAccessKeyId, setAwsAccessKeyId] = useState('');
  const [awsSecretAccessKey, setAwsSecretAccessKey] = useState('');
  const [awsSellingPartnerRole, setAwsSellingPartnerRole] = useState('');

  function isConnectButtonDisabled() {
    return (
      !websiteName ||
      !countryName ||
      !attributeName ||
      !productId ||
      !storeName ||
      !sellerId ||
      !validEmail ||
      !refreshToken ||
      !sellingPartnerAppClientId ||
      !sellingPartnerAppClientSecret ||
      !awsAccessKeyId ||
      !awsSecretAccessKey ||
      !awsSellingPartnerRole
    );
  }

  const productIdList = [{ id: 1, name: 'ASIN' }];

  function getAccountDetails() {
    const createdAt = Date.now();
    const status = 'Active';
    const countryId: number = getCountryByName(countryName)?.id;
    const attributeId = commerceProductAttributes.find(
      attribute => attribute.label === attributeName,
    ).id;
    const id = uuidV4();
    const listingSettings = {
      listProductConditionId: 1,
    };
    const orderSettings = {};
    const integrationSettings = {};
    const lifetimeSales = {
      amount: 0,
      lastUpdatedAt: null,
    };

    return {
      id,
      websiteName,
      websiteId,
      storeName,
      countryId,
      sellerId,
      attributeId,
      productId,
      emailAddress,
      createdAt,
      status,
      listingSettings,
      orderSettings,
      integrationSettings,
      lifetimeSales,
    };
  }

  async function addChannel(close) {
    setIsLoading(true);
    const accountDetails = getAccountDetails();
    await callAction(imsProps, 'api-add-account', '', accountDetails);
    await callAction(imsProps, 'api-store-credentials', '', {
      accountId: accountDetails.id,
      refreshToken,
      sellingPartnerAppClientId,
      sellingPartnerAppClientSecret,
      awsAccessKeyId,
      awsSecretAccessKey,
      awsSellingPartnerRole,
    });
    setIsLoading(false);
    close();
    window.location.reload();
  }

  const validEmail = useMemo(() => isValidEmail(emailAddress), [emailAddress]);

  return (
    <DialogTrigger>
      <Button variant={'cta'}>Add Amazon Store</Button>
      {close => (
        <Dialog>
          <Heading>
            <FormattedMessage id="addAccount.header" defaultMessage="Add Amazon sales channel" />
          </Heading>
          <Divider />
          <Content>
            <View>
              <Text>
                <FormattedMessage
                  id="addAccount.connectMessage"
                  defaultMessage="Connect your Amazon store to your Adobe Commerce store to create a single source for your catalog."
                />
              </Text>
              {isLoading || isLoadingCommerceWebsites || isLoadingProductsAttributes ? (
                <Flex alignItems="center" justifyContent="center" height="100vh">
                  <ProgressCircle size="L" aria-label="Loading…" isIndeterminate />
                </Flex>
              ) : (
                <Form maxWidth="size-4600" isRequired aria-labelledby="label-3">
                  <WebsitesList
                    commerceWebsites={commerceWebsites}
                    setWebsiteId={setWebsiteId}
                    setWebsiteName={setWebsiteName}
                    websiteName={websiteName}
                    websiteId={websiteId}
                  />
                  <TextField
                    onChange={setEmailAddress}
                    validationState={validEmail ? 'valid' : 'invalid'}
                    label={<FormattedMessage id="app.email" defaultMessage="Email Address" />}
                    type="email"
                    necessityIndicator="icon"
                  />
                  <TextField
                    onChange={setStoreName}
                    label={<FormattedMessage id="app.storeName" defaultMessage="New Store Name" />}
                    necessityIndicator="icon"
                  />
                  <CountriesList
                    countries={countries}
                    countryName={countryName}
                    setCountryName={setCountryName}
                  />
                  <Flex direction="column" marginTop={30} marginBottom={20}>
                    <Text>
                      <FormattedMessage
                        id="addAccount.mapMessage"
                        defaultMessage="Map your Adobe Commerce attributes to Amazon"
                      />
                    </Text>
                    <Divider size="S" />
                  </Flex>
                  <ProductIdList
                    productIdList={productIdList}
                    productId={productId}
                    setProductId={setProductId}
                  />
                  <AttributeList
                    commerceProductAttributes={commerceProductAttributes}
                    attributeName={attributeName}
                    setAttributeName={setAttributeName}
                  />
                  <Flex direction="column" marginTop={30} marginBottom={20}>
                    <Text>
                      <FormattedMessage
                        id="addAccount.credentialsMessage"
                        defaultMessage="Add your Amazon Seller Credentials"
                      />
                    </Text>
                    <Divider size="S" />
                  </Flex>
                  <TextField
                    onChange={setSellerId}
                    label={<FormattedMessage id="app.sellerId" defaultMessage="Seller Id" />}
                    type="password"
                    necessityIndicator="icon"
                  />
                  <TextField
                    onChange={setRefreshToken}
                    label={
                      <FormattedMessage id="app.refreshToken" defaultMessage="Refresh Token" />
                    }
                    type="password"
                    necessityIndicator="icon"
                  />
                  <TextField
                    onChange={setSellingPartnerAppClientId}
                    label={
                      <FormattedMessage
                        id="app.sellingPartnerClientId"
                        defaultMessage="Selling Partner Client Id"
                      />
                    }
                    type="password"
                    necessityIndicator="icon"
                  />
                  <TextField
                    onChange={setSellingPartnerAppClientSecret}
                    label={
                      <FormattedMessage
                        id="app.sellingPartnerClientSecret"
                        defaultMessage="Selling Partner Client Secret"
                      />
                    }
                    type="password"
                    necessityIndicator="icon"
                  />
                  <TextField
                    onChange={setAwsAccessKeyId}
                    label={
                      <FormattedMessage
                        id="app.awsAccessKeyId"
                        defaultMessage="AWS Access Key Id"
                      />
                    }
                    type="password"
                    necessityIndicator="icon"
                  />
                  <TextField
                    onChange={setAwsSecretAccessKey}
                    label={
                      <FormattedMessage
                        id="app.awsSecretAccessKey"
                        defaultMessage="AWS Secret Access Key"
                      />
                    }
                    type="password"
                    necessityIndicator="icon"
                  />
                  <TextField
                    onChange={setAwsSellingPartnerRole}
                    label={
                      <FormattedMessage
                        id="app.awsSellingPartnerRole"
                        defaultMessage="AWS Selling Partner Role"
                      />
                    }
                    type="password"
                    necessityIndicator="icon"
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
              isDisabled={isConnectButtonDisabled()}
              onPress={addChannel.bind(this, close)}
            >
              <FormattedMessage id="app.connect" defaultMessage="Connect" />
            </Button>
          </ButtonGroup>
        </Dialog>
      )}
    </DialogTrigger>
  );
}

interface WebsitesListProps {
  commerceWebsites: Array<CommerceWebsite>;
  setWebsiteId: React.Dispatch<React.SetStateAction<string>>;
  setWebsiteName: React.Dispatch<React.SetStateAction<string>>;
  websiteName: string;
  websiteId: string;
}

function WebsitesList({
  commerceWebsites,
  setWebsiteId,
  setWebsiteName,
  websiteName,
  websiteId,
}: WebsitesListProps) {
  useEffect(() => {
    if (commerceWebsites.length === 1) {
      setWebsiteId(commerceWebsites.at(0).id);
      setWebsiteName(commerceWebsites.at(0).name);
    }
  }, []);

  function isWebsiteDisabled() {
    return commerceWebsites.length === 1;
  }

  const onWebsiteInputChange = name => {
    const selectedItem = commerceWebsites.find(item => item.name === name);

    setWebsiteId(selectedItem.id);
    setWebsiteName(selectedItem.name);
  };

  return (
    <ComboBox
      label={
        <FormattedMessage
          id="addAccount.websites"
          defaultMessage="Adobe Commerce Website to use for Amazon Listing"
        />
      }
      defaultItems={commerceWebsites}
      defaultInputValue={websiteName}
      defaultSelectedKey={websiteId}
      onInputChange={onWebsiteInputChange}
      isDisabled={isWebsiteDisabled()}
    >
      {website => <Item key={website.id}>{website.name}</Item>}
    </ComboBox>
  );
}

interface CountriesListProps {
  countries: Array<{ id: number; name: string }>;
  countryName: string;
  setCountryName: React.Dispatch<React.SetStateAction<string>>;
}

function CountriesList({ countries, countryName, setCountryName }: CountriesListProps) {
  return (
    <ComboBox
      label={
        <FormattedMessage id="addAccount.country" defaultMessage="Amazon Marketplace Country" />
      }
      defaultItems={countries}
      inputValue={countryName}
      onInputChange={setCountryName}
    >
      {country => <Item key={country.id}>{country.name}</Item>}
    </ComboBox>
  );
}

interface AttributeListProps {
  commerceProductAttributes: Array<CommerceProductAttribute>;
  attributeName: string;
  setAttributeName: React.Dispatch<React.SetStateAction<string>>;
}

function AttributeList({
  commerceProductAttributes,
  attributeName,
  setAttributeName,
}: AttributeListProps) {
  return (
    <ComboBox
      label={
        <FormattedMessage
          id="addAccount.attribute"
          defaultMessage="Map an Adobe Commerce attribute"
        />
      }
      items={commerceProductAttributes}
      inputValue={attributeName}
      onInputChange={setAttributeName}
    >
      {attribute => <Item key={attribute.id}>{attribute.label}</Item>}
    </ComboBox>
  );
}

interface ProductIdListProps {
  productIdList: Array<{ id: number; name: string }>;
  productId: string;
  setProductId: React.Dispatch<React.SetStateAction<string>>;
}

function ProductIdList({ productIdList, productId, setProductId }: ProductIdListProps) {
  return (
    <ComboBox
      label={
        <FormattedMessage
          id="addAccount.product"
          defaultMessage="Product ID on the Amazon market"
        />
      }
      defaultItems={productIdList}
      inputValue={productId}
      onInputChange={setProductId}
    >
      {productIdField => <Item key={productIdField.id}>{productIdField.name}</Item>}
    </ComboBox>
  );
}
