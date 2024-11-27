import React from 'react';
import { defineMessages } from 'react-intl';

import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useSetPageHeadingTitle } from '~context/PageHeadingContext/PageHeadingContext.ts';
import { formatText } from '~utils/intl.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import Button from '~v5/shared/Button/Button.tsx';

import StreamingPaymentPageFilters from './partials/StreamingPaymentsTable/partials/StreamingPaymentFilters/StreamingPaymentFilters.tsx';
import StreamingPaymentsTable from './partials/StreamingPaymentsTable/StreamingPaymentsTable.tsx';

const displayName = 'v5.pages.StreamingPaymentsPage';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Streaming Payments',
  },
  createNewStream: {
    id: `${displayName}.createNewStream`,
    defaultMessage: 'Create new stream',
  },
});

const StreamingPaymentsPage = () => {
  useSetPageHeadingTitle(
    formatText({ id: 'navigation.finances.streamingPayments' }),
  );
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  return (
    <div>
      <div className="mb-3.5 flex-col justify-between sm:flex sm:flex-row sm:items-center">
        <div className="mb-2.5 flex items-center gap-2 sm:mb-0">
          <h4 className="heading-5">{formatText(MSG.title)}</h4>
        </div>
        <div className="flex items-center gap-2">
          <StreamingPaymentPageFilters />
          <Button
            mode="primarySolid"
            size="small"
            isFullSize={false}
            onClick={() => {
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: Action.StreamingPayment,
              });
            }}
          >
            {formatText(MSG.createNewStream)}
          </Button>
        </div>
      </div>
      <StreamingPaymentsTable />
    </div>
  );
};

StreamingPaymentsPage.displayName = displayName;

export default StreamingPaymentsPage;
