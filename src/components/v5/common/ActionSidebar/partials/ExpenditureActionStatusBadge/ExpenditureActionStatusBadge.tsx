import clsx from 'clsx';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { formatText } from '~utils/intl.ts';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';

import { EXPENDITURE_STATUS_TO_CLASSNAME_MAP } from './consts.ts';
import { useExpenditureActionStatus } from './hooks.ts';
import {
  ExpenditureActionStatus,
  type ExpenditureActionStatusBadgeProps,
} from './types.ts';

const displayName =
  'v5.common.ActionSidebar.partials.ExpenditureActionStatusBadge';

const MSG = defineMessages({
  badgeText: {
    id: `${displayName}.badgeText`,
    defaultMessage: `{activeStatus, select,
      ${ExpenditureActionStatus.Funding} {Funding}
      ${ExpenditureActionStatus.Cancel} {Cancel}
      ${ExpenditureActionStatus.Changes} {Changes}
      ${ExpenditureActionStatus.Review} {Review}
      ${ExpenditureActionStatus.Passed} {Paid}
      ${ExpenditureActionStatus.Release} {Release}
      ${ExpenditureActionStatus.Canceled} {Canceled}
      ${ExpenditureActionStatus.Payable} {Payable}
      other {Unknown}
    }`,
  },
  tooltipText: {
    id: `${displayName}.tooltipText`,
    defaultMessage: `{activeStatus, select,
      ${ExpenditureActionStatus.Funding} {There is an active funding request for this payment.}
      ${ExpenditureActionStatus.Review} {
        Payment is currently in review. The payment creator can make changes freely until details are confirmed.
      }
      ${ExpenditureActionStatus.Changes} {
        There is an active change request for this payment. Changes can be reviewed by clicking on the request.
      }
      ${ExpenditureActionStatus.Edit} {
        The payment is currently in edit mode. After making the required changes, click the “Change payment”
        button to confirm.
      }
      other {Unknown}
    }`,
  },
});

const ExpenditureActionStatusBadge: FC<ExpenditureActionStatusBadgeProps> = ({
  expenditure,
  className,
  withAdditionalStatuses,
}) => {
  const activeStatus = useExpenditureActionStatus(
    expenditure,
    withAdditionalStatuses,
  );

  const pill = (
    <PillsBase
      testId="expenditure-action-status-badge"
      className={clsx(
        className,
        EXPENDITURE_STATUS_TO_CLASSNAME_MAP[activeStatus],
        'text-sm font-medium',
      )}
    >
      {formatText(MSG.badgeText, { activeStatus })}
    </PillsBase>
  );

  return [
    ExpenditureActionStatus.Funding,
    ExpenditureActionStatus.Review,
    ExpenditureActionStatus.Changes,
    ExpenditureActionStatus.Edit,
  ].includes(activeStatus) ? (
    <Tooltip
      testId="expenditure-action-status-badge-tooltip"
      tooltipContent={formatText(MSG.tooltipText, { activeStatus })}
    >
      {pill}
    </Tooltip>
  ) : (
    pill
  );
};

ExpenditureActionStatusBadge.displayName = displayName;

export default ExpenditureActionStatusBadge;
