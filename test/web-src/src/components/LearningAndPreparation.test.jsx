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

import React from 'react';
import { screen } from '@testing-library/react';
import { customRender } from '../utils';
import { LearningAndPreparation } from '../../../../web-src/src/components/Amazon/learningAndPreparation';

describe('ProductListings', () => {
  it('should display English content by default', () => {
    customRender(<LearningAndPreparation />);

    expect(screen.queryByText('Amazon')).toBeInTheDocument();
    expect(screen.queryByText('1. Create an Amazon Seller Central account.')).toBeInTheDocument();
    expect(
      screen.queryByText('2. Make sure you are an approved seller on Amazon.'),
    ).toBeInTheDocument();
    expect(screen.queryByText('3. Configure Seller Central shipping method.')).toBeInTheDocument();
    expect(screen.queryByText('1. Enable background tasks in Adobe Commerce')).toBeInTheDocument();
    expect(
      screen.queryByText('2. Increase number of automatic catalog matches.'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        '3. If your products have more than one listing condition (e.g.: new, used, refurbished, etc.):',
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        '4. If your Amazon store uses a different currency than your Adobe Commerce store:',
      ),
    ).toBeInTheDocument();
  });
});
