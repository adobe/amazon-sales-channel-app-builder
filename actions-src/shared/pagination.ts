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

import PageableRepository = AmazonSalesChannel.PageableRepository;
import PageableOptions = AmazonSalesChannel.PageableOptions;
import Collection = AmazonSalesChannel.Collection;
import ID = AmazonSalesChannel.ID;

export function findPage<T>(
  collection: Array<T>,
  total: number,
  currentPage: number,
  itemsPerPage: number,
): Array<T> {
  const fromSlice = (currentPage - 1) * itemsPerPage;
  let toSlice = fromSlice + itemsPerPage;

  if (toSlice > total) {
    toSlice = total;
  }

  return collection.slice(fromSlice, toSlice);
}

export async function pageable<T>(
  ids: Array<ID>,
  repository: PageableRepository<T>,
  options: PageableOptions,
  page?: number,
): Promise<Collection<T>> {
  const { defaultPage, itemsPerPage } = options;

  const total = ids.length;
  const currentPage = page ?? defaultPage;

  const subsetIds = findPage<string>(ids, total, currentPage, itemsPerPage);

  const promises: Array<Promise<T>> = [];
  subsetIds.forEach((id: ID) => {
    promises.push(repository.getEntity(id));
  });

  const collection: Array<T> = await Promise.all(promises);

  return {
    total,
    collection,
    count: collection.length,
    pagination: {
      currentPage,
      lastPage: Math.ceil(total / itemsPerPage),
    },
  };
}
