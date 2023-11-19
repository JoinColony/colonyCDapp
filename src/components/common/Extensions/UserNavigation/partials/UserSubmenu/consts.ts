import { defineMessages } from 'react-intl';

import {
  COLONY_DEV_DOCS,
  COLONY_DISCORD,
  COLONY_DOCS,
  COLONY_GITHUB,
  COLONY_TWITTER,
  FEATURE_REQUEST,
  PRIVACY_POLICY,
  REPORT_BUGS,
  TERMS_AND_CONDITIONS,
} from '~constants';
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

const handleWhatsNewClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
  // Ignored undefined third party script, this should be implemented better in future
  // @ts-ignore
  // eslint-disable-next-line no-undef
  if (Beamer) {
    event.preventDefault();
    // Ignored undefined third party script, this should be implemented better in future
    // @ts-ignore
    // eslint-disable-next-line no-undef
    window.Beamer.show();
  }
};

const handleFeaturesBugsClick = (
  event: React.MouseEvent<HTMLAnchorElement>,
) => {
  // Ignored undefined third party script, this should be implemented better in future
  // @ts-ignore
  // eslint-disable-next-line no-undef
  if (Beamer) {
    event.preventDefault();
    // Ignored undefined third party script, this should be implemented better in future
    // @ts-ignore
    // eslint-disable-next-line no-undef
    Beamer.showIdeas(true);
  }
};

export const userSubmenuItems: UserSubmenuItems = {
  'userMenu.contactAndSupportTitle': [
    {
      id: 'getHelp',
      label: menuMessages.getHelp,
      url: COLONY_DOCS,
      icon: 'lifebuoy',
      external: true,
    },
    {
      id: 'featureRequest',
      label: menuMessages.whatsNew,
      url: FEATURE_REQUEST,
      icon: 'star',
      onClick: handleWhatsNewClick,
      external: true,
      className: 'beamerTrigger',
    },
    {
      id: 'reportBugs',
      label: menuMessages.featureBugs,
      url: REPORT_BUGS,
      icon: 'bug',
      onClick: handleFeaturesBugsClick,
      // external: true,
    },
    {
      id: 'discord',
      label: menuMessages.discord,
      url: COLONY_DISCORD,
      icon: 'discord-logo',
      external: true,
    },
    {
      id: 'twitter',
      label: menuMessages.twitter,
      url: COLONY_TWITTER,
      icon: 'twitter-logo',
      external: true,
    },
  ],
  'userMenu.developersTitle': [
    {
      id: 'developerDocs',
      label: menuMessages.developerDocs,
      url: COLONY_DEV_DOCS,
      icon: 'code',
      external: true,
    },
    {
      id: 'github',
      label: menuMessages.github,
      url: COLONY_GITHUB,
      icon: 'github-logo',
      external: true,
    },
  ],
  'userMenu.legalAndPrivacyTitle': [
    {
      id: 'privacyPolicy',
      label: menuMessages.privacyPolicy,
      url: PRIVACY_POLICY,
      icon: 'file-text',
      external: true,
    },
    {
      id: 'termsOfUse',
      label: menuMessages.termsOfUse,
      url: TERMS_AND_CONDITIONS,
      icon: 'files',
      external: true,
    },
  ],
};
