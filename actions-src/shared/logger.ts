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
import { format } from 'node:util';

export default class Logger {
  private logLevel: string;

  private logger;

  public constructor(logLevel: string) {
    this.logLevel = logLevel;

    this.logger = Core.Logger('main', { level: logLevel || 'info' });
  }

  public warn(message: string, params = {}) {
    this.logger.warn(JSON.stringify({ message, params }));
  }

  public debug(message: string, params = {}) {
    this.logger.debug(JSON.stringify({ message, params }));
  }

  public info(message: string, params = {}) {
    this.logger.info(JSON.stringify({ message, params }));
  }

  public error(message: string, params = {}, error?: unknown) {
    const errorAsJson: { error: string } = {
      error: JSON.stringify(error, (name, value) => {
        if (value instanceof Error) {
          return format(value);
        }
        return value;
      }),
    };

    this.logger.error(JSON.stringify({ message, ...params, ...errorAsJson }));
  }
}
