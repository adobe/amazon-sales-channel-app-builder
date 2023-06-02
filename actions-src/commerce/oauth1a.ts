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

import axios from 'axios';
import Oauth1a from 'oauth-1.0a';
import crypto from 'node:crypto';
import RequestOptions = Commerce.Model.RequestOptions;
import Logger from '../shared/logger';

interface RequestData {
  url: string;
  method: string;
  body?: unknown;
}

interface AxioxModifiedInstance {
  get<T>(url: string, requestToken?: string): Promise<T>;
  post<T>(url: string, data: unknown, requestToken?: string): Promise<T>;
  put<T>(url: string, data: unknown, requestToken?: string): Promise<T>;
  delete<T>(url: string, requestToken?: string): Promise<T>;
}

function hashFunctionSha256(baseString: string, key: string) {
  return crypto.createHmac('sha256', key).update(baseString).digest('base64');
}

function getOauthClient(
  options: RequestOptions & { version: string },
  logger: Logger,
): AxioxModifiedInstance {
  const instance = {} as AxioxModifiedInstance;

  // Remove trailing slash if any
  const serverUrl = options.url;
  const apiVersion = options.version;
  const oauth = new Oauth1a({
    consumer: {
      key: options.consumerKey,
      secret: options.consumerSecret,
    },
    signature_method: 'HMAC-SHA256',
    hash_function: hashFunctionSha256,
  });
  const token = {
    key: options.accessToken,
    secret: options.accessTokenSecret,
  };

  async function apiCall(requestData: RequestData, requestToken = '', customHeaders = {}) {
    try {
      logger.debug('Request to Commerce API', {
        serverUrl,
        endpoint: requestData.url,
        method: requestData.method,
      });

      const headers = {
        ...customHeaders,
        ...oauth.toHeader(oauth.authorize(requestData, token)),
      };

      const response = await axios({
        method: requestData.method,
        url: requestData.url,
        headers,
        data: requestData.body,
        responseType: 'json',
      });
      const responseData = response.data;
      logger.debug('Response from Commerce API', { requestData, responseData });
      return response.data;
    } catch (error) {
      logger.error('Cannot perform the Commerce API call', requestData, error);

      throw error;
    }
  }

  instance.get = async function (resourceUrl: string, requestToken = '') {
    const requestData = {
      url: createUrl(resourceUrl),
      method: 'GET',
    };
    return apiCall(requestData, requestToken);
  };

  function createUrl(resourceUrl: string, storeCode = ''): string {
    let baseUrl: string = serverUrl;
    if (storeCode !== '') {
      baseUrl += `${storeCode}/`;
    }
    return `${baseUrl}${apiVersion}/${resourceUrl}`;
  }

  instance.post = async function (
    resourceUrl: string,
    data: unknown,
    requestToken = '',
    customHeaders = {},
  ) {
    const requestData = {
      url: createUrl(resourceUrl),
      method: 'POST',
      body: data,
    };
    return apiCall(requestData, requestToken, customHeaders);
  };

  instance.put = async function (resourceUrl: string, data: unknown, requestToken = '') {
    const requestData = {
      url: createUrl(resourceUrl),
      method: 'PUT',
      body: data,
    };
    return apiCall(requestData, requestToken);
  };

  instance.delete = async function (resourceUrl: string, requestToken = '') {
    const requestData = {
      url: createUrl(resourceUrl),
      method: 'DELETE',
    };
    return apiCall(requestData, requestToken);
  };

  return instance;
}

function getCommerceOauthClient(options: RequestOptions, logger: Logger): AxioxModifiedInstance {
  const { url } = options;

  return getOauthClient(
    {
      ...options,
      version: 'V1',
      url: `${url}rest/`,
    },
    logger,
  );
}

export { getOauthClient, getCommerceOauthClient };
