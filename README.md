# Amazon Sales Channel - Adobe I/O Application

## Recommended readings
- [Prerequisites](docs/PREREQUISITES.md)
- [Contributing](docs/CONTRIBUTING.md)
- [Code of conduct](CODE_OF_CONDUCT.md)

# Installation

You may either fork or use the mainstream repository to keep up with the latest changes. In this guide, we will use mainstream repo.

## Clone application source code

```shell
git clone git@github.com:adobe/amazon-sales-channel-app-builder.git <custom-directory>
```

## Setup project dependencies

Navigate to the cloned directory and execute the following commands:

- Run `npm install` to download dependencies and have the project ready.
- Run `npm run build` to make sure the project builds correctly. This command will clean, compile and run the `aio app build`.

## Configure your application

### Add services

At the moment of writing this documentation, oAuth was not available for Eventing, so we moved forward with JWT. Therefore, we need to add the following services to our project:

#### Adobe I/O Events

1. Add a new service `Adobe I/O Events for Adobe Commerce`.
2. Select `Service Account (JWT)` authentication.
3. Generate a new key-pair (or skip it if you already have one).
4. Save configured API.

Repeat the process for `I/O Management API`.

### Setup the environment

Before proceeding, be sure you followed the [Prerequisites](docs/PREREQUISITES.md) guide.

Then, from the cloned directory, make a copy of the .env.dist file into .env and then run `aio app use` command.

```shell
> cp .env.dist .env
> aio app use
You are currently in:
1. Org: <no org selected>
2. Project: <no project selected>
3. Workspace: <no workspace selected>

? Switch to a new Adobe Developer Console configuration: A. Use the global Org / Project / Workspace configuration:
    1. Org: <your org>
    2. Project: <your project>
    3. Workspace: <your workspace>
? The file /<project_path>/.env already exists: Merge

✔ Successfully imported configuration for:
1. Org: <your org>
2. Project: <your project>
3. Workspace: <your workspace>
```

At this point the `.env` and `.aio` files should be populated. You can remove any leftover property like `AIO_ims_contexts_<App_Builder_Reference>` from the `.env` file.

Test your configuration by running `npm run deploy` to deploy your application into App Builder.

#### Fill your encryption keys

The credentials stored in the application are encrypted using an AES-256 algorithm. You'll need to generate a set of custom encryption keys and provide them to the .env file in order to secure authentication data.

| Key            | Description                      |
|----------------|----------------------------------|
| ENCRYPTION_KEY | 32 character long encryption key |
| ENCRYPTION_IV  | Initialization vector            |

#### Fill your Adobe Commerce credentials

The application needs to connect to an Adobe Commerce instance to retrieve the product catalog updates and to ingest Amazon orders. You'll need to fill the following variables inside the .env file:

| Key                                | Description                                                          |
|------------------------------------|----------------------------------------------------------------------|
| ADOBE_COMMERCE_BASE_URL            | The base URL of your Adobe Commerce instance                         |
| ADOBE_COMMERCE_CONSUMER_KEY        | The consumer key of the integration created in Adobe Commerce        |
| ADOBE_COMMERCE_CONSUMER_SECRET     | The consumer secret of the integration created in Adobe Commerce     |
| ADOBE_COMMERCE_ACCESS_TOKEN        | The access token of the integration created in Adobe Commerce        |
| ADOBE_COMMERCE_ACCESS_TOKEN_SECRET | The access token secret of the integration created in Adobe Commerce |

### Subscribe to Adobe Commerce events

Ensure that your Adobe Commerce instance is registered as an event provider.

_More information_: https://developer.adobe.com/commerce/events/get-started/configure-commerce/#subscribe-and-register-events

Then, register the `observer.catalog_product_save_after` event in your project in [developer console](https://developer.adobe.com/console/).
- Add new service of type `Event`.
- Select your event provider.
- Choose the `observer.catalog_product_save_after` event subscription.
- Select the JWT credential.
- Finally, set a name for your event registration, select your Runtime action, that should be like `amazon-app/__secured_catalog-product-save-after-listener - <your project>-<your workspace>` and save the event. 

At this point, if you go to the `Debug tracing` area in your newly event created inside the [developer console](https://developer.adobe.com/console/), you should be able to see any incoming event from your Adobe Commerce instance. 

## Local Dev environment

- *Important:* Use `npm run compile` to compile typescript files in `actions-src` to `actions`
- Run `aio app run` to start your local dev server.
  - App will run on `localhost:9080` by default if the port is available. Otherwise, check the console logs for the correct port.

By default, the UI will be served locally but actions will be deployed and served from Adobe I/O Runtime. To start a
local serverless stack and also run your actions locally use the `aio app run --local` option.

## Test & Coverage

- Run `aio app test` to run unit tests for ui and actions
- Run `aio app test --e2e` to run e2e tests

#### Adding additional action dependencies

- You have two options to resolve your actions dependencies:

  1. **Packaged action file**: Add your actions dependencies to the root
     `package.json` and install them using `npm install`. Then set the `function`
     field in `ext.config.yaml` to point to the **entry file** of your action
     folder. We will use `webpack` to package your code and dependencies into a
     single minified js file. The action will then be deployed as a single file.
     Use this method if you want to reduce the size of your actions.

  2. **Zipped action folder**: In the folder containing the action code add a
     `package.json` with the action dependencies. Then set the `function`
     field in `ext.config.yaml` to point to the **folder** of that action. We will
     install the required dependencies within that directory and zip the folder
     before deploying it as a zipped action. Use this method if you want to keep
     your action's dependencies separated.

### Debugging in VS Code

While running your local server (`aio app run`), both UI and actions can be debugged. To start debugging, open the vscode debugger
and select the debugging configuration called `WebAndActions`.
Alternatively, there are also debug configs for only UI and each separate action.

## Deploy application

```shell
npm run deploy
```

## Deploy & Cleanup

- `npm run deploy` to compile, build and deploy all typescript actions on Runtime and static files to CDN.
- `aio app undeploy` to undeploy the app.

## Typescript support for UI

To use typescript use `.tsx` extension for react components and add a `tsconfig.json` 
and make sure you have the below config added

```json
 {
  "compilerOptions": {
      "jsx": "react"
    }
  } 
```
