import { WarningCircle } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { USER_HOME_ROUTE } from '~routes';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';
import ButtonLink from '~v5/shared/Button/ButtonLink.tsx';

const displayName = 'common.Extensions.UserHub.partials.KycCard';

const MSG = defineMessages({
  verificationRequired: {
    id: `${displayName}.verificationRequired`,
    defaultMessage: 'Verification required',
  },
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Know Your Customer/Anti Money Laundering (KYC/AML)',
  },
  message: {
    id: `${displayName}.message`,
    defaultMessage:
      'Regulatory compliance requires users to verify their account by completing KYC/AML checks. It only takes a couple of minutes.',
  },
  completeVerification: {
    id: `${displayName}.completeVerification`,
    defaultMessage: 'Complete verification',
  },
});

const KycCard = () => {
  const { formatMessage } = useIntl();

  return (
    <div className="mb-4 rounded-lg border border-warning-400 p-4">
      <PillsBase
        className="bg-warning-100 text-warning-400"
        text={formatMessage(MSG.verificationRequired)}
        icon={WarningCircle}
      />
      <p className="mt-2 text-md font-medium">{formatMessage(MSG.title)}</p>
      <p className="text-sm text-gray-600">{formatMessage(MSG.message)}</p>
      <ButtonLink
        mode="primarySolid"
        // @TODO: Update to complete link
        to={USER_HOME_ROUTE}
        className="mt-3.5"
        size="small"
        text={formatMessage(MSG.completeVerification)}
      />
    </div>
  );
};

KycCard.displayName = displayName;

export default KycCard;
