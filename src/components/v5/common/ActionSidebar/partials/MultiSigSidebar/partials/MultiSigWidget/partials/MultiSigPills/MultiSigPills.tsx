import clsx from 'clsx';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { MultiSigVote } from '~gql';
import { formatText } from '~utils/intl.ts';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';
import { type PillsProps } from '~v5/common/Pills/types.ts';

const displayName =
  'v5.common.ActionSidebar.partials.MultiSig.partials.MultiSigWidget.partials.MultiSigPills';

interface MultiSigPillsProps extends PillsProps {
  multiSigState: MultiSigVote;
}

const MSG = defineMessages({
  approved: {
    id: `${displayName}.approved`,
    defaultMessage: 'Approved',
  },
  rejected: {
    id: `${displayName}.rejected`,
    defaultMessage: 'Rejected',
  },
});

const MultiSigPills: FC<MultiSigPillsProps> = ({ multiSigState }) => {
  const classes = {
    'bg-success-100 text-success-400': multiSigState === MultiSigVote.Approve,
    'bg-negative-100 text-negative-400': multiSigState === MultiSigVote.Reject,
  };
  const labels = {
    [MultiSigVote.Approve]: formatText(MSG.approved),
    [MultiSigVote.Reject]: formatText(MSG.rejected),
  };

  return (
    <PillsBase className={clsx(classes)}>{labels[multiSigState]}</PillsBase>
  );
};

export default MultiSigPills;
