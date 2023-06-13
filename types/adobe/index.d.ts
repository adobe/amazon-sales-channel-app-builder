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

declare module '@adobe/aio-sdk';

declare namespace AdobeIMS {
  interface IMSProps {
    profile: {};
    org: {};
    token: string;
    locale: string;
  }

  interface RuntimeProps {
    solution: Partial<Solution>;
  }

  interface Solution {
    icon: string;
    title: string;
    shortTitle: string;
  }
}

declare namespace AdobeRuntime {
  import Account = AmazonSalesChannel.Model.Account;

  type LogLevel = 'info' | 'debug';

  interface BaseParams {
    __ow_headers: Partial<Record<string, unknown>> & {
      authorization?: string;
    };
  }

  interface RequestParams {
    LOG_LEVEL: LogLevel;
  }

  type RequestParamsWithHeaders = RequestParams & BaseParams;

  interface AccountRequest {
    account: Account;
  }

  interface EncryptionRequest {
    ENCRYPTION_KEY: string;
    ENCRYPTION_IV: string;
  }

  type Response<B> = Promise<SuccessResponse<B> | ErrorResponse>;

  interface SuccessResponse<B> {
    statusCode: number;
    body: B;
  }

  interface ErrorResponse {
    error: {
      statusCode: number;
      body: {
        error: string;
      };
    };
  }

  type ErrorResponseHandler = (statusCode: number, message: string, logger: any) => ErrorResponse;
}
