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

import { init, StateStore } from '@adobe/aio-lib-state';
import Logger from '../logger';

export class LibStateRepository {
  protected state: StateStore | undefined;

  private readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  async getState() {
    if (!this.state) {
      this.state = await init();
    }
    return this.state;
  }
}
