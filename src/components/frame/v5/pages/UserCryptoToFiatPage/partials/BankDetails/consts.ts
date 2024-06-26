import { WarningCircle, type Icon } from '@phosphor-icons/react';
import { defineMessages } from 'react-intl';

const displayName = 'v5.pages.UserCryptoToFiat.partials.BankDetails';

export const STATUS_MSGS = defineMessages({
  // eslint-disable-next-line camelcase
  not_started: {
    id: `${displayName}.headingTitle`,
    defaultMessage: 'Bank details',
  },
});

// Add more status pills here
export const statusPillScheme: Record<
  keyof typeof STATUS_MSGS,
  {
    StatusIcon: Icon;
    bgClassName: string;
    textClassName: string;
    label: string;
  }
> = {
  // eslint-disable-next-line camelcase
  not_started: {
    StatusIcon: WarningCircle,
    bgClassName: 'bg-teams-red-50',
    textClassName: 'text-xs text-teams-red-400',
    label: 'Not started',
  },
};
