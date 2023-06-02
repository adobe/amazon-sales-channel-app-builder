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

declare namespace Commerce {
  namespace Model {
    interface RequestParams {
      operation: string;
      COMMERCE_BASE_URL: string;
      COMMERCE_CONSUMER_KEY: string;
      COMMERCE_CONSUMER_SECRET: string;
      COMMERCE_ACCESS_TOKEN: string;
      COMMERCE_ACCESS_TOKEN_SECRET: string;
    }

    interface RequestOptions {
      url: string;
      consumerKey: string;
      consumerSecret: string;
      accessToken: string;
      accessTokenSecret: string;
    }

    interface ProductAttribute {
      attribute_id: number;
      attribute_code: string;
      default_frontend_label: string;
    }
  }
}
