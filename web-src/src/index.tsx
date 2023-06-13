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

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { createRoot } from 'react-dom/client';

import Runtime, { init } from '@adobe/exc-app';

import './index.css';

import { IntlProvider } from 'react-intl';
import React from 'react';
import App from './components/app';

let translationFileFound = false;
const TRANSLATION_LOG_FORMAT = 'background: #fffdd0; color: #000000';

window.React = require('react');
/* Here you can bootstrap your application and configure the integration with the Adobe Experience Cloud Shell */
try {
  // attempt to load the Experience Cloud Runtime
  require('./exc-runtime');
  // if there are no errors, bootstrap the app in the Experience Cloud Shell
  init(bootstrapInExcShell);
} catch {
  console.log('application not running in Adobe Experience Cloud Shell');
  // fallback mode, run the application without the Experience Cloud Runtime
  bootstrapRaw();
}

function getTranslationMessages(locale) {
  const lang = `${locale.replace('-', '_')}`.toLowerCase();

  const languages = {
    ca_es: require('./translations/ca_es.json'),
    es_es: require('./translations/es_es.json'),
    fr_fr: require('./translations/fr_fr.json'),
  };

  if (lang in languages) {
    translationFileFound = true;
    return languages[lang];
  }

  console.log(
    `%cCannot find language for ${locale}. English (en_US) language is used by default`,
    TRANSLATION_LOG_FORMAT,
  );
}

function handleLocaleError(err) {
  if (!translationFileFound) return;
  console.log('%c%s', TRANSLATION_LOG_FORMAT, err.message);
}

function renderApp(runtime, ims, locale) {
  // render the actual react application and pass along the runtime and ims objects to make it available to the App
  const client = createRoot(document.querySelector('#root'));

  client.render(
    <IntlProvider
      locale={locale}
      messages={getTranslationMessages(locale)}
      defaultLocale="en-US"
      onError={handleLocaleError}
    >
      <App runtime={runtime} ims={ims} />
    </IntlProvider>,
  );
}

function bootstrapRaw() {
  /* **here you can mock the exc runtime and ims objects** */
  const mockRuntime = {
    on: () => {},
  };
  renderApp(mockRuntime, {}, window.navigator.language);
}

function bootstrapInExcShell() {
  // get the Experience Cloud Runtime object
  const runtime = Runtime();

  // use this to set a favicon
  // runtime.favicon = 'url-to-favicon'

  // use this to respond to clicks on the ap-bar title
  // runtime.heroClick = () => window.alert('Did I ever tell you you\'re my hero?')

  // ready event brings in authentication/user info
  runtime.on('ready', ({ imsOrg, imsToken, imsProfile, locale }) => {
    // tell the exc-runtime object we are done
    runtime.done();
    console.log('Ready! received imsProfile:', imsProfile);
    const ims = {
      profile: imsProfile,
      org: imsOrg,
      token: imsToken,
      locale,
    };
    renderApp(runtime, ims, locale);
  });

  // set solution info, shortTitle is used when window is too small to display full title
  runtime.solution = {
    icon: 'AdobeExperienceCloud',
    title: '272YellowCattle',
    shortTitle: 'JGR',
  };
  runtime.title = '272YellowCattle';
}
