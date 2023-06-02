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

import {
  checkMissingRequestInputs,
  errorResponse,
  getBearerToken,
  stringParameters,
} from '../../../actions-src/shared/utils';
import Logger from '../../../actions-src/shared/logger';
import Mock = jest.Mock;

jest.mock('../../../actions-src/shared/logger');

test('interface', () => {
  expect(typeof errorResponse).toBe('function');
  expect(typeof stringParameters).toBe('function');
  expect(typeof checkMissingRequestInputs).toBe('function');
  expect(typeof getBearerToken).toBe('function');
});

describe('errorResponse', () => {
  beforeEach(() => {
    (Logger as Mock).mockClear();
  });

  it('(400, errorMessage without logger)', () => {
    const res = errorResponse(400, 'errorMessage without logger');
    expect(res).toEqual({
      error: {
        statusCode: 400,
        body: { error: 'errorMessage without logger' },
      },
    });
  });

  it('(400, errorMessage, logger)', () => {
    const logger = {
      info: jest.fn(),
    } as unknown as Logger;

    const res = errorResponse(400, 'errorMessage', logger);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(logger.info).toHaveBeenCalledWith('400: errorMessage');
    expect(res).toEqual({
      error: {
        statusCode: 400,
        body: { error: 'errorMessage' },
      },
    });
  });
});

describe('stringParameters', () => {
  it('no auth header', () => {
    const params = {
      a: 1,
      b: 2,
      __ow_headers: { 'x-api-key': 'fake-api-key' },
    };
    expect(stringParameters(params)).toEqual(JSON.stringify(params));
  });

  it('with auth header', () => {
    const params = {
      a: 1,
      b: 2,
      __ow_headers: { 'x-api-key': 'fake-api-key', 'authorization': 'secret' },
    };

    expect(stringParameters(params)).toEqual(
      expect.stringContaining('"authorization":"<hidden>"'),
    );

    expect(stringParameters(params)).not.toEqual(expect.stringContaining('secret'));
  });
});

describe('checkMissingRequestInputs', () => {
  it('({ a: 1, b: 2 }, [a])', () => {
    expect(checkMissingRequestInputs({ a: 1, b: 2 }, ['a'])).toEqual(null);
  });

  it('({ a: 1 }, [a, b])', () => {
    expect(checkMissingRequestInputs({ a: 1 }, ['a', 'b'])).toEqual("missing parameter(s) 'b'");
  });

  it('({ a: { b: { c: 1 } }, f: { g: 2 } }, [a.b.c, f.g.h.i])', () => {
    expect(
      checkMissingRequestInputs({ a: { b: { c: 1 } }, f: { g: 2 } }, ['a.b.c', 'f.g.h.i']),
    ).toEqual("missing parameter(s) 'f.g.h.i'");
  });

  it('({ a: { b: { c: 1 } }, f: { g: 2 } }, [a.b.c, f.g.h])', () => {
    expect(
      checkMissingRequestInputs({ a: { b: { c: 1 } }, f: { g: 2 } }, ['a.b.c', 'f']),
    ).toEqual(null);
  });

  it('({ a: 1, __ow_headers: { h: 1, i: 2 } }, undefined, [h])', () => {
    expect(
      checkMissingRequestInputs({ a: 1, __ow_headers: { h: 1, i: 2 } }, undefined, ['h']),
    ).toEqual(null);
  });

  it('({ a: 1, __ow_headers: { f: 2 } }, [a], [h, i])', () => {
    expect(
      checkMissingRequestInputs({ a: 1, __ow_headers: { f: 2 } }, ['a'], ['h', 'i']),
    ).toEqual("missing header(s) 'h,i'");
  });

  it('({ c: 1, __ow_headers: { f: 2 } }, [a, b], [h, i])', () => {
    expect(checkMissingRequestInputs({ c: 1 }, ['a', 'b'], ['h', 'i'])).toEqual(
      "missing header(s) 'h,i' and missing parameter(s) 'a,b'",
    );
  });

  it('({ a: 0 }, [a])', () => {
    expect(checkMissingRequestInputs({ a: 0 }, ['a'])).toEqual(null);
  });

  it('({ a: null }, [a])', () => {
    expect(checkMissingRequestInputs({ a: null }, ['a'])).toEqual(null);
  });

  it("({ a: '' }, [a])", () => {
    expect(checkMissingRequestInputs({ a: '' }, ['a'])).toEqual("missing parameter(s) 'a'");
  });

  it('({ a: undefined }, [a])', () => {
    expect(checkMissingRequestInputs({ a: undefined }, ['a'])).toEqual("missing parameter(s) 'a'");
  });
});

describe('getBearerToken', () => {
  it('({})', () => {
    expect(getBearerToken({})).toEqual(undefined);
  });

  it('({ authorization: Bearer fake, __ow_headers: {} })', () => {
    expect(getBearerToken({ authorization: 'Bearer fake', __ow_headers: {} })).toEqual(undefined);
  });

  it('({ authorization: Bearer fake, __ow_headers: { authorization: fake } })', () => {
    expect(
      getBearerToken({
        authorization: 'Bearer fake',
        __ow_headers: { authorization: 'fake' },
      }),
    ).toEqual(undefined);
  });

  it('({ __ow_headers: { authorization: Bearerfake} })', () => {
    expect(getBearerToken({ __ow_headers: { authorization: 'Bearerfake' } })).toEqual(undefined);
  });

  it('({ __ow_headers: { authorization: Bearer fake} })', () => {
    expect(getBearerToken({ __ow_headers: { authorization: 'Bearer fake' } })).toEqual('fake');
  });

  it('({ __ow_headers: { authorization: Bearer fake Bearer fake} })', () => {
    expect(
      getBearerToken({ __ow_headers: { authorization: 'Bearer fake Bearer fake' } }),
    ).toEqual('fake Bearer fake');
  });
});
