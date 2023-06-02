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
import { randomUUID } from 'node:crypto';
import Logger from '../../../shared/logger';
import AttributeMap = AmazonSalesChannel.Model.AttributeMap;
import AttributeValue = AmazonSalesChannel.Model.AttributeValue;
import AttributeValues = AmazonSalesChannel.Model.AttributeValues;
import Attribute = AmazonSalesChannel.Model.Attribute;

const ATTRIBUTES_LIST_KEY = 'attributes';

export interface Attributes {
  value?: Array<string>;
}

export class AttributeRepository {
  private state: StateStore | undefined;

  private readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  static buildAttributeKey(marketplaceId: string, amazonAttributeName: string): string {
    return `${marketplaceId}-${amazonAttributeName}`.toUpperCase();
  }

  async getState() {
    if (!this.state) {
      this.state = await init();
    }
    return this.state;
  }

  async getAttributes() {
    const state = await this.getState();
    const attributesKeys = (await state.get('attributes')) as Attributes;
    const attributesPromises: Array<Promise<Attribute>> = [];
    const keys = attributesKeys?.value ?? [];
    keys.forEach(key => {
      attributesPromises.push(state.get(key));
    });

    const attr = await Promise.all(attributesPromises).then(values =>
      values.flatMap(f => (f ? [f] : [])),
    );
    return attr;
  }

  async getAttributeKeys(): Promise<Array<string>> {
    this.state = await this.getState();
    const res = await this.state.get(ATTRIBUTES_LIST_KEY);
    return res?.value ?? [];
  }

  async getAttribute(marketplaceId: string, amazonAttributeName: string): Promise<AttributeMap> {
    return this.getAttributeByKey(
      AttributeRepository.buildAttributeKey(marketplaceId, amazonAttributeName),
    );
  }

  async getAttributeByKey(key: string): Promise<AttributeMap> {
    this.state = await this.getState();
    const res = await this.state.get(key);
    return res?.value ?? null;
  }

  async saveAttribute(attribute: AttributeMap) {
    this.state = await this.getState();
    const attributeKey = AttributeRepository.buildAttributeKey(
      attribute.marketplaceId,
      attribute.amazonAttributeName,
    );
    if (attribute.id == null) {
      attribute.id = randomUUID();
      await this.addAttributeKeyToAttributesList(attributeKey);
    }
    await this.state.put(attributeKey, attribute, { ttl: -1 });
  }

  async saveAttributeValue(
    marketplaceId: string,
    amazonAttributeName: string,
    attributeValue: AttributeValue,
  ) {
    this.state = await this.getState();
    const attributeKey = AttributeRepository.buildAttributeKey(marketplaceId, amazonAttributeName);

    const attribute: AttributeMap = await this.getAttribute(marketplaceId, amazonAttributeName);
    const currentAttributeValues: AttributeValues =
      attribute.values === undefined ? {} : attribute.values;
    currentAttributeValues[attributeValue.sku] = attributeValue;
    attribute.values = currentAttributeValues;

    await this.state.put(attributeKey, attribute, { ttl: -1 });
  }

  private async addAttributeKeyToAttributesList(attributeKey: string) {
    let currentAttributeKeys: string[] = [];
    await this.getAttributeKeys().then(res => {
      currentAttributeKeys = res;
    });

    currentAttributeKeys = [...new Set([...currentAttributeKeys, attributeKey])];

    this.state = await this.getState();
    await this.state.put(ATTRIBUTES_LIST_KEY, currentAttributeKeys, { ttl: -1 });
  }
}
