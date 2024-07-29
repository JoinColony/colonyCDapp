import { type Icon } from '@phosphor-icons/react';

type Theme = 'red' | 'green' | 'orange' | 'gray' | 'light-orange';

type ThemeConfig = {
  className: string;
  iconClassName?: string;
};

export type CryptoToFiatBadgeTheme = Record<Theme, ThemeConfig>;

export type CryptoToFiatBadgeProps = {
  theme: Theme;
  text: string;
  icon?: Icon;
};
