import { ExclamationMark, type Icon } from '@phosphor-icons/react';
import { defineMessages } from 'react-intl';

const displayName = 'v5.pages.UserCryptoToFiat.partials.BankDetails';

export const STATUS_MSGS = defineMessages({
  // update these keys to match the actual status
  notStarted: {
    id: `${displayName}.headingTitle`,
    defaultMessage: 'Bank details',
  },
});

// Add more status pills here
export const statusPillScheme: Record<
  keyof typeof STATUS_MSGS,
  { icon: Icon; bgClassName: string; textClassName: string }
> = {
  notStarted: {
    icon: ExclamationMark,
    bgClassName: 'bg-teams-red-50',
    textClassName: 'text-xs text-teams-red-400',
  },
};
