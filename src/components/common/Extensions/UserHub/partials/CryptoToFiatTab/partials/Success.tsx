import { Confetti } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { COLONY_HOME_ROUTE } from '~routes';
import { formatMessage } from '~utils/yup/tests/helpers.ts';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';
import Button from '~v5/shared/Button/index.ts';

const displayName = 'common.Extensions.UserHub.partials.Success';

const MSG = defineMessages({
  awaiting: {
    id: `${displayName}.awaiting`,
    defaultMessage: 'Awaiting funds',
  },
  onItsWay: {
    id: `${displayName}.onItsWay`,
    defaultMessage: `Your payment is on it's way to your bank account`,
  },
  shouldArrive: {
    id: `${displayName}.shouldArrive`,
    defaultMessage: 'It should arrive within 3 days from {bankName}',
  },
  arbiscan: {
    id: `${displayName}.arbiscan`,
    defaultMessage: 'View on Arbiscan',
  },
  makeAnotherTransfer: {
    id: `${displayName}.makeAnotherTransfer`,
    defaultMessage: 'Make another transfer',
  },
});

const Success = ({ resetForm }: { resetForm: () => void }) => {
  return (
    <div className="flex flex-col items-center pt-8">
      <Confetti size={42} />
      <PillsBase
        className="mt-3 bg-warning-100 text-warning-400"
        text={formatMessage(MSG.awaiting)}
      />
      <h3 className="mt-3 px-12 text-center heading-3">
        {formatMessage(MSG.onItsWay)}
      </h3>
      <p className="my-3.5 text-sm">
        {formatMessage(MSG.shouldArrive, { bankName: 'BANK_NAME' })}
      </p>
      {/* @TODO: Update to proper link */}
      <a href={COLONY_HOME_ROUTE} className="mb-20 text-sm underline">
        {formatMessage(MSG.arbiscan)}
      </a>
      <Button
        mode="primarySolid"
        className="mb-6 mt-4 w-full"
        text={formatMessage(MSG.makeAnotherTransfer)}
        onClick={resetForm}
      />
    </div>
  );
};

Success.displayName = displayName;

export default Success;
