import { WarningCircle } from '@phosphor-icons/react';
import { defineMessages } from 'react-intl';

import { KycStatus } from '~gql';
import { type BridgeBankAccount } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import { type CryptoToFiatBadgeProps } from '~v5/common/Pills/CryptoToFiatBadge.tsx/types.ts';

import { type KycStatusData } from '../../types.ts';

export const displayName =
  'v5.pages.UserCryptoToFiatPage.partials.AutomaticDeposits';

export const STATUS_MSGS = defineMessages({
  // update these keys to match the actual status
  kycPaymentRequired: {
    id: `${displayName}.headingTitle`,
    defaultMessage: 'Bank details',
  },
});

export const getBadgeProps = ({
  bankAccountData,
  isAutoOfframEnabled,
  kycStatusData,
}: {
  kycStatusData?: KycStatusData | null;
  bankAccountData: BridgeBankAccount | null;
  isAutoOfframEnabled: boolean;
}): CryptoToFiatBadgeProps => {
  if (kycStatusData) {
    if (kycStatusData?.kycStatus !== KycStatus.Approved && !bankAccountData) {
      return {
        text: formatText({
          id: `${displayName}.statusPill.incomplete`,
          defaultMessage: 'Complete KYC & payment details',
        }),
        icon: WarningCircle,
        theme: 'red',
      };
    }

    // @TODO Figure out if this is still valid
    // This is based on the Figma design: https://www.figma.com/design/C2grfQysdsYXz0j4rADR6K/Crypto-to-Fiat?node-id=2401-10068&t=nxBQFcmRmZgCoLap-0
    // I think this should now be kycStatusData?.kyc_status === KycStatus.APPROVED && !bankAccountData
    if (kycStatusData?.kycStatus !== KycStatus.Approved && !!bankAccountData) {
      return {
        text: formatText({
          id: `${displayName}.statusPill.kycRequired`,
          // I think this should now say Bank details required
          defaultMessage: 'KYC required',
        }),
        icon: WarningCircle,
        theme: 'red',
      };
    }
  }

  if (isAutoOfframEnabled) {
    return {
      text: formatText({
        id: `${displayName}.statusPill.complete`,
        defaultMessage: 'Automatic bank deposit on',
      }),
      theme: 'green',
    };
  }

  return {
    text: formatText({
      id: `${displayName}.statusPill.complete`,
      defaultMessage: 'Automatic bank deposit off',
    }),
    theme: 'gray',
  };
};

export const HEADING_MSG = defineMessages({
  headingTitle: {
    id: `${displayName}.headingTitle`,
    defaultMessage: 'Enable automatic deposits',
  },
  headingAccessory: {
    id: `${displayName}.headingAccessory`,
    defaultMessage: 'Optional',
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
