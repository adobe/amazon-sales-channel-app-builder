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

import { camelCase } from 'lodash';

// deeply maps keys with whatever callback function defined (string) => string
// Map, Sets not supported
export function deepMapKeys(obj, cb) {
  if (Array.isArray(obj)) {
    return obj.map(x => deepMapKeys(x, cb));
  }

  if (obj !== null && typeof obj === 'object') {
    const newObject = {};
    Object.keys(obj).forEach(key => {
      let val;
      const value = obj[key];

      // eslint-disable-next-line prefer-const
      val = obj !== null && typeof value === 'object' ? deepMapKeys(value, cb) : value;

      const mappedKey = cb(key);
      newObject[mappedKey] = val;
    });

    return newObject;
  }
  return obj;
}

export function camelCaseKeys(obj) {
  return deepMapKeys(obj, camelCase);
}
