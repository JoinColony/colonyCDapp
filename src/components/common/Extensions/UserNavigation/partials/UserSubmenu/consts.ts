import { UserSubmenuItems } from './types';

export const userSubmenuItems: UserSubmenuItems = {
  'userMenu.contactAndSupportTitle': [
    {
      id: 'getHelp',
      label: 'Get help',
      url: '/get-help',
      icon: 'lifebuoy',
    },
    {
      id: 'featureRequest',
      label: 'Feature request',
      url: '/feature-request',
      icon: 'star',
    },
    {
      id: 'reportBugs',
      label: 'Report bugs',
      url: '/report-bugs',
      icon: 'bug',
    },
    {
      id: 'discord',
      label: 'Discord',
      url: '/discord',
      icon: 'discord-logo',
    },
    {
      id: 'twitter',
      label: 'Twitter',
      url: '/twitter',
      icon: 'twitter-logo',
    },
  ],
  'userMenu.developersTitle': [
    {
      id: 'developerDocs',
      label: 'Developer docs',
      url: '/developer-docs',
      icon: 'code',
    },
    {
      id: 'github',
      label: 'Github',
      url: '/github',
      icon: 'github-logo',
    },
  ],
  'userMenu.legalAndPrivacyTitle': [
    {
      id: 'privacyPolicy',
      label: 'Privacy policy',
      url: '/privacy-policy',
      icon: 'file-text',
    },
    {
      id: 'termsOfUse',
      label: 'Terms of use',
      url: '/terms-of-use',
      icon: 'files',
    },
  ],
};
