import React from 'react';

import StreamingPaymentsTable from './partials/StreamingPaymentsTable/StreamingPaymentsTable.tsx';

const displayName = 'pages.StreamingPaymentsPage';

const StreamingPaymentsPage = () => {
  return (
    <div>
      <StreamingPaymentsTable />
    </div>
  );
};

StreamingPaymentsPage.displayName = displayName;

export default StreamingPaymentsPage;
