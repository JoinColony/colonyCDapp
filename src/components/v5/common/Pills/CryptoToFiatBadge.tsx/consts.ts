import { type CryptoToFiatBadgeTheme } from './types.ts';

export const badgeThemes: CryptoToFiatBadgeTheme = {
  red: {
    className: 'bg-negative-100 text-negative-400',
    iconClassName: 'text-negative-400 h-3',
  },
  green: {
    className: 'bg-teams-green-100 text-teams-green-400',
  },
  orange: {
    className: 'bg-orange-100 text-orange-400',
  },
  gray: {
    className: 'bg-gray-100 text-gray-400',
  },
};
