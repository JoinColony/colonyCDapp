import { WarningCircle } from '@phosphor-icons/react';
import { defineMessages } from 'react-intl';

import { KycStatus } from '~gql';
import { type BridgeBankAccount } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import { type CryptoToFiatBadgeProps } from '~v5/common/Pills/CryptoToFiatBadge.tsx/types.ts';

import { type KycStatusData } from '../../types.ts';
import { type RowItemBodyProps } from '../RowItem/types.ts';

import { BankDetailsStatus } from './types.ts';

export const displayName = 'v5.pages.UserCryptoToFiat.partials.BankDetails';

export const HEADING_MSG = defineMessages({
  title: {
    id: `${displayName}.heading.title`,
    defaultMessage: 'Bank details',
  },
  accessory: {
    id: `${displayName}.headingAccessory`,
    defaultMessage: 'Required',
  },
});

export const CTA_MSG = defineMessages({
  [BankDetailsStatus.COMPLETED]: {
    id: `${displayName}.body.ctaTitle.completed`,
    defaultMessage: 'Completed',
  },
  [BankDetailsStatus.NOT_STARTED]: {
    id: `${displayName}.body.ctaTitle.notCompleted`,
    defaultMessage: 'Add details',
  },
});

export const getBadgeProps = (
  status?: string | null,
): CryptoToFiatBadgeProps => {
  switch (status) {
    case BankDetailsStatus.COMPLETED: {
      return {
        text: formatText({
          id: `${displayName}.statusPill.complete`,
          defaultMessage: 'Completed',
        }),
        theme: 'green',
      };
    }
    case BankDetailsStatus.NOT_STARTED: {
      return {
        text: formatText({
          id: `${displayName}.statusPill.notStarted`,
          defaultMessage: 'Not started',
        }),
        icon: WarningCircle,
        theme: 'red',
      };
    }
    default: {
      return {
        text: formatText({
          id: `${displayName}.statusPill.unknown`,
          defaultMessage: 'Unknown',
        }),
        theme: 'red',
      };
    }
  }
};

export const getCTAScheme = ({
  bankAccountData,
  kycStatusData,
}: {
  kycStatusData?: KycStatusData | null;
  bankAccountData?: BridgeBankAccount | null;
}): Pick<RowItemBodyProps, 'ctaDisabled' | 'ctaTitle'> => {
  if (bankAccountData) {
    return {
      ctaTitle: {
        id: `${displayName}.body.ctaTitle`,
        defaultMessage: 'Update details',
      },
    };
  }

  return {
    ctaTitle: {
      id: `${displayName}.body.ctaTitle`,
      defaultMessage: 'Add details',
    },
    ctaDisabled:
      bankAccountData || kycStatusData?.kycStatus !== KycStatus.Approved,
  };
};
