# Prerequisites

## Adobe Commerce
- At least Adobe Commerce 2.4.5+ is required
- You should have access from outside the Commerce environment (external network)
- You should have the ability to add API integration

## Adobe Developer Console
- You should have access to Adobe IO Runtime
- You should have access to Adobe IO Events
- You should create a project in the Adobe Developer Console portal

## Adobe I/O CLI
Install [Adobe I/O CLI] following these steps:
- Run `npm install -g @adobe/aio-cli` to install Adobe I/O Extensible CLI.
  - If it's your first time, you will need to run `aio login` to authenticate to console.
  - Select your organization by running `aio console org select`.
  - Select your project running `aio console project select`.
  - Finally, select "Stage " as your workspace `aio console workspace select`.

For further information, please refer to [Adobe I/O CLI documentation](https://github.com/adobe/aio-cli/blob/master/README.md).

## Amazon SP API

Amazon Sales Channels uses [Amazon SP API](https://github.com/amz-tools/amazon-sp-api) to communicate with Amazon Seller Central.

To properly configure Amazon SP API, you should have:
- Admin access to [Amazon Seller Central](https://sellercentral.amazon.com/)
- Permissions to add Developer Applications

### Amazon Web Services
Create IAM policy per [Amazon SPI Guide]

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

You'll need the following set of Amazon credentials when creating an account in the application:

| Field                 | Where to get                                              |
|-----------------------|-----------------------------------------------------------|
| Client ID             | In [Developer Central]                                    |
| Client secret         | In [Developer Central]                                    |
| Client refresh token  | In [Developer Central] -> Authorize                       |
| AWS access key        | In [AWS] -> IAM -> User with access t IAM role            |
| AWS secret access key | In [AWS] -> IAM -> User with access t IAM role            |
| AWS Role ARN          | Create [AWS] IAM role                                     |
| Target marketplace    | [ASC Marketplace IDs]                                     |
| Unique Seller ID      | [Amazon Seller Central] -> Account Info -> Merchant Token |

## Install local development environment

The following package needs to be installed locally to properly register events:
- [aio-cli-plugin-extension](https://github.com/adobe/aio-cli-plugin-extension)

The following packages need to be installed locally to properly run your aio with --local flag enabled:
- [Java 11 or superior](https://www.oracle.com/es/java/technologies/javase/jdk11-archive-downloads.html)
- [Maven](https://maven.apache.org/)
- [Docker](https://docs.docker.com/desktop/install/mac-install)

# References

[Amazon Seller Central]: https://sellercentral.amazon.com
[ASC Marketplace IDs]: https://developer-docs.amazon.com/sp-api/docs/marketplace-ids
[Adobe I/O CLI]: https://developer.adobe.com/runtime/docs/guides/tools/cli_install
[Amazon SPI Guide]: https://developer-docs.amazon.com/sp-api/docs/creating-and-configuring-iam-policies-and-entities
[Developer Central]: https://sellercentral.amazon.com/marketplacedeveloper/applications
[AWS]: https://aws.amazon.com/
