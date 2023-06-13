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

import Status = AmazonSalesChannel.Model.Status;
import Logger from '../../../../shared/logger';

const ProductsByStatusRequestParam: Record<string, string> = {
  active: Status.ACTIVE,
  inactive: Status.INACTIVE,
  incomplete: Status.INCOMPLETE,
  newThirdParty: Status.NEW_THIRD_PARTY,
  readyToList: Status.READY_TO_LIST,
  ineligible: Status.INELIGIBLE,
  ended: Status.ENDED,
  overrides: Status.OVERRIDE,
};

export class InputProductValidation {
  private readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  validate(status: string) {
    if (!Object.keys(ProductsByStatusRequestParam).includes(status)) {
      this.logger.error('Product status was not found', { status });
      throw new Error(`Product status ${status} was not found`);
    }
  }

  transform(status: string) {
    this.validate(status);

    return ProductsByStatusRequestParam[status];
  }
}
