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

import { renderHook } from '@testing-library/react';
import React from 'react';
import { useImsContext } from '../../../../web-src/src/hooks/useImsContext';

describe('useImsContext', () => {
  it('should pass through {runtime, ims} values', () => {
    const initialProps: AmazonSalesChannel.IMSContextProps = {
      ims: {
        token: '123',
        locale: 'EN-en',
      },
      runtime: {
        solution: {},
      },
    };

    jest.spyOn(React, 'useContext').mockImplementationOnce(() => initialProps);

    const { result } = renderHook(useImsContext);

    expect(result.current.ims?.token).toStrictEqual('123');
    expect(result.current.ims?.locale).toStrictEqual('EN-en');
  });
});
