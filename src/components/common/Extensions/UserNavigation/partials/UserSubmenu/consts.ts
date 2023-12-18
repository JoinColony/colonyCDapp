import { defineMessages } from 'react-intl';

import {
  COLONY_DEV_DOCS,
  COLONY_DISCORD,
  COLONY_DOCS,
  COLONY_GITHUB,
  COLONY_TWITTER,
  FEATURES_BUGS,
  WHATS_NEW,
  PRIVACY_POLICY,
  TERMS_AND_CONDITIONS,
} from '~constants';
import { openFeaturesBugs, openWhatsNew } from '~hooks/useBeamer';
import { formatText } from '~utils/intl';
import { SetStateFn } from '~types';
import { SupportedCurrencies } from '~gql';

import { UserSubmenuItems } from './types';

import { UserSubmenuItems } from './types';

export const menuMessages = defineMessages({
  getHelp: {
    id: 'UserSubmenu.getHelp',
    defaultMessage: 'Get help',
  },
  whatsNew: {
    id: 'UserSubmenu.whatsNew',
    defaultMessage: "What's new",
  },
  featureBugs: {
    id: 'UserSubmenu.featureBugs',
    defaultMessage: 'Features & Bugs',
  },
  discord: {
    id: 'UserSubmenu.discord',
    defaultMessage: 'Discord',
  },
  twitter: {
    id: 'UserSubmenu.twitter',
    defaultMessage: 'Twitter',
  },
  developerDocs: {
    id: 'UserSubmenu.developerDocs',
    defaultMessage: 'Developer docs',
  },
  github: {
    id: 'UserSubmenu.github',
    defaultMessage: 'Github',
  },
  privacyPolicy: {
    id: 'UserSubmenu.privacyPolicy',
    defaultMessage: 'Privacy policy',
  },
  termsOfUse: {
    id: 'UserSubmenu.termsOfUse',
    defaultMessage: 'Terms of use',
  },
});

export const currencyIconTitles = {
  [SupportedCurrencies.Usd]: 'us',
  [SupportedCurrencies.Jpy]: 'japan',
  [SupportedCurrencies.Gbp]: 'uk',
  [SupportedCurrencies.Eur]: 'eu',
  [SupportedCurrencies.Cad]: 'canada',
  [SupportedCurrencies.Krw]: 'southkorea',
  [SupportedCurrencies.Inr]: 'india',
  [SupportedCurrencies.Brl]: 'brazil',
  [SupportedCurrencies.Eth]: 'ether',
  [SupportedCurrencies.Clny]: 'clny-token',
};

export const userSubmenuItems = ({
  handleCurrencyClick,
}: {
  handleCurrencyClick: SetStateFn<SupportedCurrencies>;
}): UserSubmenuItems => ({
  'userMenu.contactAndSupportTitle': [
    {
      id: 'getHelp',
      label: formatText(menuMessages.getHelp),
      url: COLONY_DOCS,
      icon: 'lifebuoy',
      external: true,
    },
    {
      id: 'featureRequest',
      label: formatText(menuMessages.whatsNew),
      url: WHATS_NEW,
      icon: 'star',
      onClick: openWhatsNew,
      external: true,
      className: 'beamerTrigger',
    },
    {
      id: 'reportBugs',
      label: formatText(menuMessages.featureBugs),
      url: FEATURES_BUGS,
      icon: 'bug',
      onClick: openFeaturesBugs,
      external: true,
    },
    {
      id: 'discord',
      label: formatText(menuMessages.discord),
      url: COLONY_DISCORD,
      icon: 'discord-logo',
      external: true,
    },
    {
      id: 'twitter',
      label: formatText(menuMessages.twitter),
      url: COLONY_TWITTER,
      icon: 'twitter-logo',
      external: true,
    },
  ],
  'userMenu.developersTitle': [
    {
      id: 'developerDocs',
      label: formatText(menuMessages.developerDocs),
      url: COLONY_DEV_DOCS,
      icon: 'code',
      external: true,
    },
    {
      id: 'github',
      label: formatText(menuMessages.github),
      url: COLONY_GITHUB,
      icon: 'github-logo',
      external: true,
    },
  ],
  'userMenu.legalAndPrivacyTitle': [
    {
      id: 'privacyPolicy',
      label: formatText(menuMessages.privacyPolicy),
      url: PRIVACY_POLICY,
      icon: 'file-text',
      external: true,
    },
    {
      id: 'termsOfUse',
      label: formatText(menuMessages.termsOfUse),
      url: TERMS_AND_CONDITIONS,
      icon: 'files',
      external: true,
    },
  ],
  'userMenu.supportedCurrenciesTitle': Object.values(SupportedCurrencies)
    .reverse()
    .map((currency) => ({
      id: currency,
      label: currency.toUpperCase(),
      icon: currencyIconTitles[currency],
      external: false,
      onClick: () => handleCurrencyClick(currency),
    })),
});
