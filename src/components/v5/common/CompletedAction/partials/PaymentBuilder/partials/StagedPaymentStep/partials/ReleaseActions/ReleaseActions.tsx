import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { type ExpenditureAction, type Expenditure } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';

import ReleaseActionItem from './ReleaseActionItem.tsx';

const displayName =
  'v5.common.CompletedAction.partials.PaymentBuilder.partials.StagedReleaseStep.partials.ReleaseActions';

interface ReleaseActionsProps {
  actions: ExpenditureAction[];
  expenditure: Expenditure;
}

const MSG = defineMessages({
  milestonePayments: {
    id: `${displayName}.releases`,
    defaultMessage: 'Milestone payments',
  },
});

const ReleaseActions: FC<ReleaseActionsProps> = ({ expenditure, actions }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-base-white p-[1.125rem]">
      <h3 className="mb-2 text-1">{formatText(MSG.milestonePayments)}</h3>
      <div className="max-h-[10.25rem] overflow-x-hidden overflow-y-scroll">
        <ul className="flex flex-col gap-2 overflow-hidden">
          {actions.map((action) => (
            <li key={action.transactionHash}>
              <ReleaseActionItem action={action} expenditure={expenditure} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

ReleaseActions.displayName = displayName;

export default ReleaseActions;
