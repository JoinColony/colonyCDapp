import { ArrowRight } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { useEffect, type FC } from 'react';
import { defineMessages } from 'react-intl';

import { usePaymentBuilderContext } from '~context/PaymentBuilderContext/PaymentBuilderContext.ts';
import { convertPeriodToHours } from '~utils/extensions.ts';
import { formatText } from '~utils/intl.ts';
import { ExpenditureStep } from '~v5/common/CompletedAction/partials/PaymentBuilder/partials/PaymentBuilderWidget/types.ts';

import RecipientAvatar from './partials/RecipientAvatar/RecipientAvatar.tsx';
import TokenField from './partials/TokenField/TokenField.tsx';
import { type EditContentProps } from './types.ts';

const displayName =
  'v5.common.ActionsContent.partials.PaymentBuilderTable.partials.EditContent';

interface Changes {
  recipient?: {
    old: string;
    new: string;
  };
  claimDelay?: {
    old: string;
    new: string;
  };
  token?: {
    tokenAddress: {
      old: string;
      new: string;
    };
    amount: {
      old: string;
      new: string;
    };
  };
}

const MSG = defineMessages({
  hours: {
    id: `${displayName}.hours`,
    defaultMessage: `{hours, plural, one {hour} other {hours}}`,
  },
  changes: {
    id: `${displayName}.changes`,
    defaultMessage: 'CHANGES',
  },
  proposedChanges: {
    id: `${displayName}.proposedChanges`,
    defaultMessage: 'PROPOSED CHANGES',
  },
  current: {
    id: `${displayName}.current`,
    defaultMessage: 'CURRENT',
  },
});

const renderElement = (
  key: string,
  value: {
    new: string;
    old: string;
    amount: {
      old: string;
      new: string;
    };
    tokenAddress: {
      old: string;
      new: string;
    };
  },
  isNew: boolean,
) => {
  if (key === 'recipient') {
    return (
      <RecipientAvatar
        userAddress={isNew ? value.new : value.old || ''}
        isNew={isNew}
      />
    );
  }

  if (key === 'claimDelay') {
    if (!value.old && !isNew) {
      return <p className="text3">-</p>;
    }

    const delay = convertPeriodToHours(isNew ? value.new : value.old);
    return (
      <div className="flex items-center gap-1">
        <p
          className={clsx('text-3', {
            'text-blue-400': isNew,
            'text-gray-900': !isNew,
          })}
        >
          {delay}
        </p>
        <p className="text-md">{formatText(MSG.hours, { hours: delay })}</p>
      </div>
    );
  }

  if (key === 'token') {
    return (
      <TokenField
        amount={isNew ? value.amount?.new : value.amount?.old}
        tokenAddress={isNew ? value.tokenAddress?.new : value.tokenAddress?.old}
        isNew={isNew}
      />
    );
  }

  return <div />;
};

const EditContent: FC<EditContentProps> = ({ actionRow }) => {
  const { original, toggleExpanded } = actionRow;
  const { oldValues, newValues } = original;
  const { selectedEditingAction, currentStep } = usePaymentBuilderContext();
  const isMotion = !!selectedEditingAction?.motionData;

  useEffect(() => {
    if (!currentStep?.startsWith(ExpenditureStep.Edit)) {
      toggleExpanded();
    }
  }, [currentStep, toggleExpanded]);

  const changes: Changes = {};

  if (newValues?.recipientAddress !== oldValues?.recipientAddress) {
    changes.recipient = {
      old: oldValues?.recipientAddress || '',
      new: newValues?.recipientAddress || '',
    };
  }

  if (newValues?.claimDelay !== oldValues?.claimDelay) {
    changes.claimDelay = {
      old: oldValues?.claimDelay || '',
      new: newValues?.claimDelay || '',
    };
  }

  if (newValues?.payouts) {
    newValues?.payouts.forEach((newPayout, index) => {
      const oldPayout = oldValues?.payouts?.[index];

      if (
        newPayout.tokenAddress !== oldPayout?.tokenAddress ||
        newPayout.amount !== oldPayout.amount
      ) {
        changes.token = {
          tokenAddress: {
            old: oldPayout?.tokenAddress || '',
            new: newPayout.tokenAddress,
          },
          amount: {
            old: oldPayout?.amount || '',
            new: newPayout.amount,
          },
        };
      }
    });
  }

  return (
    <div className="mx-2 my-2 rounded bg-gray-50 px-3.5 py-3 sm:mx-0">
      <div className="mb-4 flex items-center justify-between gap-2 text-gray-600 text-4">
        <p>{formatText(MSG.current)}</p>
        <p>{formatText(isMotion ? MSG.proposedChanges : MSG.changes)}</p>
      </div>
      {Object.keys(changes).map((key) => (
        <div key={key} className="mb-4 grid grid-cols-[1fr_14px_1fr] last:mb-0">
          <div>{renderElement(key, changes[key], false)}</div>
          <ArrowRight size={14} className="text-gray-400" />
          <div className="ml-auto">
            {renderElement(key, changes[key], true)}
          </div>
        </div>
      ))}
    </div>
  );
};

EditContent.displayName = displayName;

export default EditContent;
