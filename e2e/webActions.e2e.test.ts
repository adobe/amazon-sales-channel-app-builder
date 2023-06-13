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

import fetch from 'node-fetch';
import { Core } from '@adobe/aio-sdk';

// get action url
const namespace = Core.Config.get('runtime.namespace') as string;
const hostname = (Core.Config.get('cna.hostname') as string) || 'adobeioruntime.net';
const runtimePackage = 'amazon-app';

const actionEndpoint = `https://${namespace}.${hostname}/api/v1/web/${runtimePackage}`;

test.skip('returns a 200 when calling api-delete-account action', async () => {
  const actionUrl = `${actionEndpoint}/api-delete-account`;
  const res = await fetch(actionUrl);
  expect(res).toEqual(
    expect.objectContaining({
      status: 200,
    }),
  );
});

test('returns a 200 when calling api-get-accounts action', async () => {
  const actionUrl = `${actionEndpoint}/api-get-accounts`;
  const res = await fetch(actionUrl);
  expect(res).toEqual(
    expect.objectContaining({
      status: 200,
    }),
  );
});

describe('api-get-communication-error-logs', () => {
  test('returns a 200 with communication error logs', async () => {
    const actionUrl = `${actionEndpoint}/api-get-communication-error-logs`;
    const res = await fetch(actionUrl);
    expect(res).toEqual(
      expect.objectContaining({
        status: 200,
      }),
    );
  });
});
