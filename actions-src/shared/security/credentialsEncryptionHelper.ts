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

import { randomBytes } from 'node:crypto';
import { decrypt, encrypt } from './encrypt';
import Credentials = AmazonSalesChannel.Model.Credentials;

export class CredentialsEncryptionHelper {
  private readonly key: Buffer;

  private readonly iv: Buffer;

  constructor(key: string, iv?: string) {
    this.key = Buffer.from(key);

    this.iv = iv === undefined || iv === '' ? randomBytes(16) : Buffer.from(iv);
  }

  public encryptCredentials(credentials: Credentials): string {
    return this.encrypt(JSON.stringify(credentials));
  }

  public decryptCredentials(text: string): Credentials {
    return JSON.parse(this.decrypt(text)) as unknown as Credentials;
  }

  public encrypt(text: string): string {
    return encrypt(text, { key: this.key, iv: this.iv });
  }

  public decrypt(text: string): string {
    return decrypt(text, { key: this.key, iv: this.iv });
  }
}
