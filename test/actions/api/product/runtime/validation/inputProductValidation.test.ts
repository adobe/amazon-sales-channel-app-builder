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

import { Core } from '@adobe/aio-sdk';
import {
  InputProductValidation,
} from '../../../../../../actions-src/api/product/runtime/validation/inputProductValidation';
import Logger from '../../../../../../actions-src/shared/logger';

jest.mock('@adobe/aio-sdk', () => ({
  Core: {
    Logger: jest.fn(),
  },
}));

const mockLoggerInstance = { info: jest.fn(), debug: jest.fn(), error: jest.fn() };
Core.Logger.mockReturnValue(mockLoggerInstance);

const inputProductValidation = new InputProductValidation(new Logger('info'));

describe('inputProductValidation', () => {
  it('Validate input product and transform it', () => {
    const status = inputProductValidation.transform('newThirdParty');

    expect(status).toBe('NEW_THIRD_PARTY');
  });

  it('Validate input product and transform it throws error', () => {
    expect(() => {
      inputProductValidation.transform('unexistingStatus');
    }).toThrow(Error);
  });
});
