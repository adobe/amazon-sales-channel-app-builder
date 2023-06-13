# Prerequisites

At least nodeJS 16.13+ is required.

## Adobe Commerce

- **At least Adobe Commerce 2.4.5+ is required**
- You should have access from outside the Commerce environment (external network)
- You should have the ability to add API integration

Follow The [Adobe Commerce Admin UI SDK overview](https://developer-stage.adobe.com/commerce/extensibility/admin-ui-sdk/) If you want to attach the App builder application into the Adobe Commerce Admin.

### Create custom attributes

In order to subscribe to catalog update events from Adobe Commerce, you should create the following custom attributes in Stores -> Attributes -> Product -> Add New Attribute:

| Default label    | Attribute Code   | Scope  | Notes                                                                                                                                                                                   |
|------------------|------------------|--------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ASIN             | asin             | Global |                                                                                                                                                                                         |
| Amazon Condition | amazon_condition | Global | Condition of the listing item. Find the list of possible values in [Amazon docs](https://developer-docs.amazon.com/sp-api/docs/listings-items-api-v2021-08-01-reference#conditiontype). |

### Subscribe to catalog update events

First thing is to ensure that your Adobe Commerce instance is registered as an event provider. Follow [the get started guide](https://developer.adobe.com/commerce/events/get-started/configure-commerce/) to do so.

Once your instance is configured and the event provider is created, you should subscribe to the `observer.catalog_product_save_after` event. To do that, ssh into your Adobe Commerce instance using a terminal and run the following command:

`bin/magento events:subscribe observer.catalog_product_save_after --fields=sku --fields=price --fields=stock_data.qty --fields=asin --fields=amazon_condition --fields=name`

## Adobe Developer Console

- You should have access to Adobe IO Runtime
- You should have access to Adobe IO Events
- You should create a project in the [Adobe Developer Console portal](https://developer.adobe.com/console/)

### Adobe I/O CLI

Install [Adobe I/O CLI](https://developer.adobe.com/runtime/docs/guides/tools/cli_install) following these steps:

- Run `npm install -g @adobe/aio-cli` to install Adobe I/O Extensible CLI.
  - If it's your first time, you will need to run `aio login` to authenticate to console.
  - Select your organization by running `aio console org select`.
  - Select your project running `aio console project select`.
  - Finally, select "Stage " as your workspace `aio console workspace select`.

For further information, please refer to [Adobe I/O CLI documentation](https://github.com/adobe/aio-cli/blob/master/README.md).

## App Builder local development dependencies

The following package needs to be installed locally to properly register events:

- [aio-cli-plugin-extension](https://github.com/adobe/aio-cli-plugin-extension)

The following packages need to be installed locally to properly run your aio with --local flag enabled:

- [Java 11 or superior](https://www.oracle.com/es/java/technologies/javase/jdk11-archive-downloads.html)
- [Maven](https://maven.apache.org/)
- [Docker](https://docs.docker.com/desktop/install/mac-install)

## Amazon SP API

Amazon Sales Channels uses [Amazon SP API](https://github.com/amz-tools/amazon-sp-api) to communicate with Amazon Seller Central.

To properly configure Amazon SP API, you should have:

- Admin access to [Amazon Seller Central](https://sellercentral.amazon.com/)
- Permissions to add Developer Applications

### Amazon Web Services

Create IAM policy per [Amazon SPI Guide](https://developer-docs.amazon.com/sp-api/docs/creating-and-configuring-iam-policies-and-entities)

### Amazon Seller Central

#### Choose an integration type

Application is deployed for particular instance, so the intended flow is to register application as `Private`.

See more about [different app types](https://developer-docs.amazon.com/sp-api/docs/determine-app-type)

#### Register yourself as a Private Developer

Follow [this section](https://developer-docs.amazon.com/sp-api/docs/registering-as-a-developer#to-register-as-a-private-developer-for-private-seller-applications) to register as private developer

#### Register an application

Follow [this section](https://developer-docs.amazon.com/sp-api/docs/registering-your-application) to register your application

#### Generate access keys

Follow [this section](https://developer-docs.amazon.com/sp-api/docs/self-authorization) to generate access keys

You'll need the following set of Amazon credentials when creating an account from the App Builder application UI:

| Field                 | Where to get                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| Client ID             | In [Developer Central](https://sellercentral.amazon.com/marketplacedeveloper/applications)              |
| Client secret         | In [Developer Central](https://sellercentral.amazon.com/marketplacedeveloper/applications)              |
| Client refresh token  | In [Developer Central](https://sellercentral.amazon.com/marketplacedeveloper/applications) -> Authorize |
| AWS access key        | In [AWS](https://aws.amazon.com/) -> IAM -> User with access t IAM role                                 |
| AWS secret access key | In [AWS](https://aws.amazon.com/) -> IAM -> User with access t IAM role                                 |
| AWS Role ARN          | Create [AWS](https://aws.amazon.com/) IAM role                                                          |
| Target marketplace    | [ASC Marketplace IDs](https://developer-docs.amazon.com/sp-api/docs/marketplace-ids)                    |
| Unique Seller ID      | [Amazon Seller Central](https://sellercentral.amazon.com) -> Account Info -> Merchant Token             |
