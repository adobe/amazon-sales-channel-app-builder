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

import { createCipheriv, createDecipheriv } from 'node:crypto';
import { DecryptionError } from './decryptionError';

interface CipherArgs {
  key: Buffer;
  iv: Buffer;
}

const ALGORITHM = 'aes-256-gcm';

export function encrypt(text: string, cipherArgs: CipherArgs): string {
  const { key, iv } = cipherArgs;

  const cipher = createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  const authTag = cipher.getAuthTag().toString('hex');
  return [encrypted.toString('hex'), authTag].join(':');
}

export function decrypt(text: string, cipherArgs: CipherArgs): string {
  const [encryptedData, authTag] = text.split(':');

  const { key, iv } = cipherArgs;
  const encryptedText = Buffer.from(encryptedData, 'hex');
  try {
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  } catch {
    throw new DecryptionError('Unable to decipher encrypted message');
  }
}
