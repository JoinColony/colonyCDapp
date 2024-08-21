import { WarningCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
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

interface KycCardProps {
  link: string;
  isKycStatusLoading: boolean;
}

const KycCard: FC<KycCardProps> = ({ link, isKycStatusLoading }) => {
  const { formatMessage } = useIntl();

  return (
    <div
      className={clsx(
        'mb-4 rounded-lg border border-warning-400 px-[17px] py-4',
        {
          '!border-gray-200': isKycStatusLoading,
        },
      )}
    >
      <LoadingSkeleton
        isLoading={isKycStatusLoading}
        className="mb-2 h-[26px] w-[157px] rounded-3xl"
      >
        <PillsBase
          className="mb-2 bg-warning-100 text-warning-400"
          text={formatMessage(MSG.verificationRequired)}
          icon={WarningCircle}
        />
      </LoadingSkeleton>
      <LoadingSkeleton
        className="mb-2 h-5 w-full rounded"
        isLoading={isKycStatusLoading}
      >
        <p className="mb-2 text-md font-medium">{formatMessage(MSG.title)}</p>
      </LoadingSkeleton>
      <LoadingSkeleton
        className="mb-2 h-[11px] w-full rounded"
        isLoading={isKycStatusLoading}
      >
        <p className="mb-3.5 text-sm text-gray-600">
          {formatMessage(MSG.message)}
        </p>
      </LoadingSkeleton>
      <LoadingSkeleton
        className="mb-3.5 h-[11px] w-full rounded"
        isLoading={isKycStatusLoading}
      />
      <LoadingSkeleton
        className="h-[34px] w-full rounded-lg"
        isLoading={isKycStatusLoading}
      >
        <ButtonLink
          mode="primarySolid"
          to={link}
          size="small"
          text={formatMessage(MSG.completeVerification)}
        />
      </LoadingSkeleton>
    </div>
  );
};

KycCard.displayName = displayName;

export default KycCard;
