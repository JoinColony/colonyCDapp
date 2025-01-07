import React from 'react';

import { useSetPageHeadingTitle } from '~context/PageHeadingContext/PageHeadingContext.ts';
import { formatText } from '~utils/intl.ts';

const displayName = 'v5.pages.StreamingPaymentsPage';

const StreamingPaymentsPage = () => {
  useSetPageHeadingTitle(formatText({ id: 'streamingPaymentsPage.title' }));

  return <div />;
};

StreamingPaymentsPage.displayName = displayName;

export default StreamingPaymentsPage;
