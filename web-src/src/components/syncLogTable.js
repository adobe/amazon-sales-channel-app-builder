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

import { Cell, Column, Row, TableBody, TableHeader, TableView } from '@adobe/react-spectrum';

function renderSwitch(syncLog, columnKey) {
  switch (columnKey) {
    case 'orderIds': {
      return syncLog[columnKey].join(', ');
    }
    default: {
      return syncLog[columnKey];
    }
  }
}

const SyncLogTable = ({ syncLogs }) => {
  syncLogs = syncLogs.filter(syncLog => typeof syncLog === 'object');
  // eslint-disable-next-line array-callback-return
  syncLogs.map(syncLog => {
    syncLog.id = syncLog.orderIds.join('');
  });

  const columns = [
    { name: 'Date', uid: 'date' },
    { name: 'Order Count', uid: 'orderCount' },
    { name: 'Order Ids', uid: 'orderIds' },
  ];

  return (
    <TableView density="spacious" overflowMode="wrap" aria-label="sync logs table" maxWidth="100%">
      <TableHeader columns={columns}>
        {column => <Column key={column.uid}>{column.name}</Column>}
      </TableHeader>
      <TableBody items={syncLogs}>
        {syncLog => <Row>{columnKey => <Cell>{renderSwitch(syncLog, columnKey)}</Cell>}</Row>}
      </TableBody>
    </TableView>
  );
};

export default SyncLogTable;
