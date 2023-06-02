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

declare namespace AmazonSalesChannel {
  interface IMSContextProps {
    ims?: Readonly<Partial<AdobeIMS.IMSProps>>;
    runtime?: Readonly<Partial<AdobeIMS.RuntimeProps>>;
  }

  interface Pagination {
    lastPage: number;
    currentPage: number;
  }

  export interface PageableRepository<T> {
    getEntity: (id: ID) => Promise<T>;
  }

  interface PageableOptions {
    defaultPage: number;
    itemsPerPage: number;
  }

  interface Collection<T> {
    collection: Array<T>;
    total: number;
    count: number;
    pagination: Pagination;
  }

  interface ErrorResponse<T = string> {
    error: T;
  }
}
