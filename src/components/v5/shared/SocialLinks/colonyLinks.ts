import {
  DiscordLogo,
  FacebookLogo,
  GithubLogo,
  Globe,
  type IconProps,
  InstagramLogo,
  Scroll,
  TelegramLogo,
  TwitterLogo,
  YoutubeLogo,
} from '@phosphor-icons/react';
import { type ComponentType } from 'react';
import { defineMessages } from 'react-intl';

import { ExternalLinks } from '~gql';
import { formatText } from '~utils/intl.ts';

const linksPrefix = 'socialLinks';
const MSG = defineMessages({
  [ExternalLinks.Custom]: {
    id: `${linksPrefix}.custom`,
    defaultMessage: 'Website',
  },
  [ExternalLinks.Whitepaper]: {
    id: `${linksPrefix}.whitepaper`,
    defaultMessage: 'Whitepaper',
  },
  [ExternalLinks.Youtube]: {
    id: `${linksPrefix}.youtube`,
    defaultMessage: 'Youtube',
  },
  [ExternalLinks.Discord]: {
    id: `${linksPrefix}.discord`,
    defaultMessage: 'Discord',
  },
  [ExternalLinks.Twitter]: {
    id: `${linksPrefix}.twitter`,
    defaultMessage: 'Twitter',
  },
  [ExternalLinks.Telegram]: {
    id: `${linksPrefix}.telegram`,
    defaultMessage: 'Telegram',
  },
  [ExternalLinks.Github]: {
    id: `${linksPrefix}.github`,
    defaultMessage: 'Github',
  },
  [ExternalLinks.Facebook]: {
    id: `${linksPrefix}.facebook`,
    defaultMessage: 'Facebook',
  },
  [ExternalLinks.Instagram]: {
    id: `${linksPrefix}.instagram`,
    defaultMessage: 'Instagram',
  },
});

export type ColonyLink = {
  id: ExternalLinks;
  label: string | undefined;
  LinkIcon: ComponentType<IconProps>;
};
export const COLONY_LINK_CONFIG: Record<ExternalLinks, ColonyLink> = {
  [ExternalLinks.Custom]: {
    id: ExternalLinks.Custom,
    LinkIcon: Globe,
    label: formatText(MSG[ExternalLinks.Custom]),
  },
  [ExternalLinks.Whitepaper]: {
    id: ExternalLinks.Whitepaper,
    LinkIcon: Scroll,
    label: formatText(MSG[ExternalLinks.Whitepaper]),
  },
  [ExternalLinks.Github]: {
    id: ExternalLinks.Github,
    LinkIcon: GithubLogo,
    label: formatText(MSG[ExternalLinks.Github]),
  },
  [ExternalLinks.Discord]: {
    id: ExternalLinks.Discord,
    LinkIcon: DiscordLogo,
    label: formatText(MSG[ExternalLinks.Discord]),
  },
  [ExternalLinks.Twitter]: {
    id: ExternalLinks.Twitter,
    LinkIcon: TwitterLogo,
    label: formatText(MSG[ExternalLinks.Twitter]),
  },
  [ExternalLinks.Telegram]: {
    id: ExternalLinks.Telegram,
    LinkIcon: TelegramLogo,
    label: formatText(MSG[ExternalLinks.Telegram]),
  },
  [ExternalLinks.Youtube]: {
    id: ExternalLinks.Youtube,
    LinkIcon: YoutubeLogo,
    label: formatText(MSG[ExternalLinks.Youtube]),
  },
  [ExternalLinks.Facebook]: {
    id: ExternalLinks.Facebook,
    LinkIcon: FacebookLogo,
    label: formatText(MSG[ExternalLinks.Facebook]),
  },
  [ExternalLinks.Instagram]: {
    id: ExternalLinks.Instagram,
    LinkIcon: InstagramLogo,
    label: formatText(MSG[ExternalLinks.Instagram]),
  },
};
