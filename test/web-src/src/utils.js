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

import { IntlProvider } from 'react-intl';
import { lightTheme, Provider } from '@adobe/react-spectrum';
import { HashRouter } from 'react-router-dom';
import React from 'react';
import { render } from '@testing-library/react';

export const screenDefault = (props = { width: 1000, height: 1000 }) => {
  jest
    .spyOn(window.HTMLElement.prototype, 'clientWidth', 'get')
    .mockImplementation(() => props.width);
  jest
    .spyOn(window.HTMLElement.prototype, 'clientHeight', 'get')
    .mockImplementation(() => props.height);
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
  jest.spyOn(window.screen, 'width', 'get').mockImplementation(() => 1024);
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => setTimeout(cb, 0));
};

export const TestProvider = ({ children }) => (
  <IntlProvider locale={window.navigator.language} defaultLocale="en-US">
    <Provider theme={lightTheme} colorScheme={'light'}>
      <HashRouter>{children}</HashRouter>
    </Provider>
  </IntlProvider>
);

export const customRender = (ui, options) => render(ui, { wrapper: TestProvider, ...options });
