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
import { decrypt, encrypt } from '../../../../actions-src/shared/security/encrypt';

const PASSPHRASE = 'bf3c199c2470cb477d907b1e0917c17b'; // set random encryption key
const IV = '7d63996eeece379bbfbe90851d2f60ba';

const cipherArgs = {
    key: Buffer.from(PASSPHRASE),
    iv: Buffer.from(IV),
};

describe('Encrypt', () => {
    it.concurrent('can encrypt/decrypt text', () => {
        const encryptedAuth = encrypt('John Doe', cipherArgs);
        const decryptedAuth = decrypt(encryptedAuth, cipherArgs);

        expect(decryptedAuth).toEqual('John Doe');
    });

    it.concurrent('fails decrypt payload with incorrect IV', () => {
        const encryptedAuth: string = encrypt('John Doe', cipherArgs);

        expect(() => {
            decrypt(encryptedAuth, { ...cipherArgs, iv: Buffer.from(randomBytes(16).toString('hex')) });
        }).toThrow('Unable to decipher encrypted message');
    });
});
