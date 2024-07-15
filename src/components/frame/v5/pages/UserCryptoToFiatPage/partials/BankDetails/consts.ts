import { WarningCircle } from '@phosphor-icons/react';
import { defineMessages } from 'react-intl';

import { formatText } from '~utils/intl.ts';

import { statusPillThemes } from '../../constants.ts';
import { type StatusPillScheme, type KycStatusData } from '../../types.ts';
import { type RowItemBodyProps } from '../RowItem/types.ts';
import { KycStatus } from '../Verification/types.ts';

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

export const getStatusPillScheme = (
  status?: string | null,
): StatusPillScheme => {
  switch (status) {
    case BankDetailsStatus.COMPLETED: {
      return {
        copy: formatText({
          id: `${displayName}.statusPill.complete`,
          defaultMessage: 'Completed',
        }),
        ...statusPillThemes.green,
      };
    }
    case BankDetailsStatus.NOT_STARTED: {
      return {
        copy: formatText({
          id: `${displayName}.statusPill.notStarted`,
          defaultMessage: 'Not started',
        }),
        icon: WarningCircle,
        ...statusPillThemes.red,
      };
    }
    default: {
      return {
        copy: formatText({
          id: `${displayName}.statusPill.unknown`,
          defaultMessage: 'Unknown',
        }),
        ...statusPillThemes.red,
      };
    }
  }
};

export const getCTAScheme = ({
  bankAccountData,
  kycStatusData,
}: {
  kycStatusData: KycStatusData | null;
  bankAccountData: KycStatusData['bankAccount'];
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
      bankAccountData || kycStatusData?.kyc_status !== KycStatus.APPROVED,
  };
};
