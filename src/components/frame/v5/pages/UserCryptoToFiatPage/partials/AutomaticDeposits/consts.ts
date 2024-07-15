import { WarningCircle } from '@phosphor-icons/react';
import { defineMessages } from 'react-intl';

import { formatText } from '~utils/intl.ts';

import { statusPillThemes } from '../../constants.ts';
import { type StatusPillScheme, type KycStatusData } from '../../types.ts';
import { KycStatus } from '../Verification/types.ts';

const displayName = 'v5.pages.UserCryptoToFiatPage.partials.AutomaticDeposits';

export const STATUS_MSGS = defineMessages({
  // update these keys to match the actual status
  kycPaymentRequired: {
    id: `${displayName}.headingTitle`,
    defaultMessage: 'Bank details',
  },
});

export const getStatusPillScheme = ({
  bankAccountData,
  isAutoOfframEnabled,
  kycStatusData,
}: {
  kycStatusData: KycStatusData | null;
  bankAccountData: KycStatusData['bankAccount'];
  isAutoOfframEnabled: boolean;
}): StatusPillScheme => {
  if (kycStatusData) {
    if (kycStatusData?.kyc_status !== KycStatus.APPROVED && !bankAccountData) {
      return {
        copy: formatText({
          id: `${displayName}.statusPill.incomplete`,
          defaultMessage: 'Complete KYC & payment details',
        }),
        icon: WarningCircle,
        ...statusPillThemes.red,
      };
    }

    // @TODO Figure out if this is still valid
    //  This is based on the Figma design: https://www.figma.com/design/C2grfQysdsYXz0j4rADR6K/Crypto-to-Fiat?node-id=2401-10068&t=nxBQFcmRmZgCoLap-0
    if (kycStatusData?.kyc_status !== KycStatus.APPROVED && !!bankAccountData) {
      return {
        copy: formatText({
          id: `${displayName}.statusPill.kycRequired`,
          defaultMessage: 'KYC required',
        }),
        icon: WarningCircle,
        ...statusPillThemes.red,
      };
    }
  }

  if (isAutoOfframEnabled) {
    return {
      copy: formatText({
        id: `${displayName}.statusPill.complete`,
        defaultMessage: 'Automatic bank deposit on',
      }),
      ...statusPillThemes.green,
    };
  }

  return {
    copy: formatText({
      id: `${displayName}.statusPill.complete`,
      defaultMessage: 'Automatic bank deposit off',
    }),
    ...statusPillThemes.gray,
  };
};

export const HEADING_MSG = defineMessages({
  headingTitle: {
    id: `${displayName}.headingTitle`,
    defaultMessage: 'Bank details',
  },
  headingAccessory: {
    id: `${displayName}.headingAccessory`,
    defaultMessage: 'Required',
  },
});

export const BODY_MSG = defineMessages({
  bodyTitle: {
    id: `${displayName}.bodyTitle`,
    defaultMessage: 'Automatically deposit USDC payments to your bank account',
  },
  bodyDescription: {
    id: `${displayName}.bodyDescription`,
    defaultMessage:
      'Enable this to automatically USD or EUR in your account any time you receive a USDC payment from the colony app. A gateway fee, plus any transaction costs will be deducted from your payment',
  },
  bodyCtaTitle: {
    id: `${displayName}.bodyCtaTitle`,
    defaultMessage: 'Start KYC',
  },
});
