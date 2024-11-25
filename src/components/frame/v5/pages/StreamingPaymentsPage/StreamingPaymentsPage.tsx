import React from 'react';

import { useSetPageHeadingTitle } from '~context/PageHeadingContext/PageHeadingContext.ts';
import { formatText } from '~utils/intl.ts';

import StreamingPaymentsTable from './partials/StreamingPaymentsTable/StreamingPaymentsTable.tsx';

const displayName = 'v5.pages.StreamingPaymentsPage';

const StreamingPaymentsPage = () => {
  useSetPageHeadingTitle(
    formatText({ id: 'navigation.finances.streamingPayments' }),
  );

  return (
    <div>
      <StreamingPaymentsTable />
    </div>
  );
};

StreamingPaymentsPage.displayName = displayName;

export default StreamingPaymentsPage;
