# Amazon Sales Channel - Adobe I/O Application

## Recommended readings
- [Pre-requisites](docs/PREREQUISITES.md)
- [Contributing](docs/CONTRIBUTING.md)
- [Code of conduct](CODE_OF_CONDUCT.md)

# Installation

You may either fork or use the mainstream repository to keep up with the latest changes. In this guide, we will use mainstream repo.

## Clone application source code

```shell
git clone git@github.com:magento-commerce/aio-amazon-sales-channel.git <custom-directory>
```

## Setup

Navigate to the cloned directory and execute the following commands:

- Run `npm install` to download dependencies and have the project ready.
- Populate the `.env` file in the project root and fill it as shown [below](#setup-the-environment).
- Run `npm run build` to make sure the project builds correctly. This command will clean, compile and run the `aio app build`.

## Configuration

### Setup the environment

You can generate the `.env` file using the command `aio app use`. 

```shell
# This file must **not** be committed to source control

## please provide your Adobe I/O Runtime credentials
# AIO_RUNTIME_AUTH=
# AIO_RUNTIME_NAMESPACE=
```

Make sure to have all needed variables correctly defined (rf. `.env.dist` file).

### `manifest.yml`

- List your backend actions under the `actions` field within the `__APP_PACKAGE__`
package placeholder. We will take care of replacing the package name placeholder
by your project name and version.
- For each action, use the `function` field to indicate the path to the action
code.
- More documentation for supported action fields can be found [here](https://github.com/apache/incubator-openwhisk-wskdeploy/blob/master/specification/html/spec_actions.md#actions).

#### Action Dependencies

- You have two options to resolve your actions' dependencies:

  1. **Packaged action file**: Add your action's dependencies to the root
   `package.json` and install them using `npm install`. Then set the `function`
   field in `manifest.yml` to point to the **entry file** of your action
   folder. We will use `parcelJS` to package your code and dependencies into a
   single minified js file. The action will then be deployed as a single file.
   Use this method if you want to reduce the size of your actions.

  2. **Zipped action folder**: In the folder containing the action code add a
     `package.json` with the action's dependencies. Then set the `function`
     field in `manifest.yml` to point to the **folder** of that action. We will
     install the required dependencies within that directory and zip the folder
     before deploying it as a zipped action. Use this method if you want to keep
     your action's dependencies separated.

## Local Dev environment

- *Important:* `npm run compile` to compile typescript files in `actions-src` to `actions`
- `aio app run` to start your local dev server.
- App will run on `localhost:9080` by default of the port is available. Otherwise, check the console logs for the correct port.

By default, the UI will be served locally but actions will be deployed and served from Adobe I/O Runtime. To start a
local serverless stack and also run your actions locally use the `aio app run --local` option.

## Test & Coverage

- Run `aio app test` to run unit tests for ui and actions
- Run `aio app test --e2e` to run e2e tests

### Debugging in VS Code

While running your local server (`aio app run`), both UI and actions can be debugged, to do so open the vscode debugger
and select the debugging configuration called `WebAndActions`.
Alternatively, there are also debug configs for only UI and each separate action.

# Deploy to Adobe IO

## Populate IMS credentials

1. Navigate to the cloned directory
2. Attach your application to a specific project and workspace:

```shell
aio app:use
```

You should see a similar message and select it if everything is correct:

```shell
? Switch to a new Adobe Developer Console configuration: (Use arrow keys)
❯ A. Use the global Org / Project / Workspace configuration:
1. Org: <your-org>
2. Project: <your-project>
3. Workspace: <your-workspace>
```

## Provide custom credentials

A complete list of custom credentials and their description is available in the [dist file](../.env.dist)

### Encryption keys

The credentials stored in the application are encrypted. You'll need to generate encryption keys and provide them to the application in order to secure them.

| Key            | Description                      |
|----------------|----------------------------------|
| ENCRYPTION_KEY | 32 character long encryption key |
| ENCRYPTION_IV  | Initialization vector            |

## Deploy application

```shell
aio app:deploy
```

## Deploy & Cleanup

- `aio app deploy` to build and deploy all actions on Runtime and static files to CDN
- `aio app undeploy` to undeploy the app

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
