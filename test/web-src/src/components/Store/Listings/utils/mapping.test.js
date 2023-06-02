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

import { camelCaseKeys } from '../../../../../../../web-src/src/utils/mapping';

describe('camelCaseKeys', () => {
  it('should camelCaseKeys deep within an object or array', () => {
    const result = camelCaseKeys({
      'what_a_day': [
        {
          'test_me': 'foo',
          '--foo-bar--': true,
          '--bar-foo--': {
            nested_value: {},
          },
        },
      ],
      '--foo-bar--': undefined,
      '--bar-foo--': null,
      '--boolean-boolean--': true,
    });

    expect(result).toStrictEqual({
      whatADay: [
        {
          testMe: 'foo',
          fooBar: true,
          barFoo: {
            nestedValue: {},
          },
        },
      ],
      fooBar: undefined,
      barFoo: null,
      booleanBoolean: true,
    });
  });

  it('should work with an array', () => {
    const result = camelCaseKeys([
      {
        'test_me': 'foo',
        '--foo-bar--': true,
        '--bar-foo--': {
          nested_value: {},
        },
      },
    ]);

    expect(result).toStrictEqual([
      {
        testMe: 'foo',
        fooBar: true,
        barFoo: {
          nestedValue: {},
        },
      },
    ]);
  });
});
