import {
  DiscordLogo,
  GithubLogo,
  GlobeHemisphereEast,
  IconProps,
  InstagramLogo,
  Scroll,
  TelegramLogo,
  TwitterLogo,
  YoutubeLogo,
} from 'phosphor-react';
import { ComponentType } from 'react';
import { ExternalLinks } from '~gql';
import { formatText } from '~utils/intl';

export type ColonyLink = {
  id: ExternalLinks;
  label: string | undefined;
  LinkIcon: ComponentType<IconProps>;
};
export const COLONY_LINK_CONFIG: Record<ExternalLinks, ColonyLink> = {
  [ExternalLinks.Custom]: {
    id: ExternalLinks.Custom,
    LinkIcon: GlobeHemisphereEast,
    label: formatText({ id: 'socialLinks.custom' }),
  },
  [ExternalLinks.Whitepaper]: {
    id: ExternalLinks.Whitepaper,
    LinkIcon: Scroll,
    label: formatText({ id: 'socialLinks.whitepaper' }),
  },
  [ExternalLinks.Youtube]: {
    id: ExternalLinks.Youtube,
    LinkIcon: YoutubeLogo,
    label: formatText({ id: 'socialLinks.youtube' }),
  },
  [ExternalLinks.Discord]: {
    id: ExternalLinks.Discord,
    LinkIcon: DiscordLogo,
    label: formatText({ id: 'socialLinks.discord' }),
  },
  [ExternalLinks.Twitter]: {
    id: ExternalLinks.Twitter,
    LinkIcon: TwitterLogo,
    label: formatText({ id: 'socialLinks.twitter' }),
  },
  [ExternalLinks.Telegram]: {
    id: ExternalLinks.Twitter,
    LinkIcon: TelegramLogo,
    label: formatText({ id: 'socialLinks.telegram' }),
  },
  [ExternalLinks.Github]: {
    id: ExternalLinks.Twitter,
    LinkIcon: GithubLogo,
    label: formatText({ id: 'socialLinks.custom' }),
  },
  /* Uncomment when Facebook is added to ExternalLinks enum
  [ExternalLinks.Facebook]: {
    id: ExternalLinks.Facebook,
    LinkIcon:FacebookLogo,
    label: formatText({ id: 'socialLinks.facebook' })
  },
  */
  [ExternalLinks.Instagram]: {
    id: ExternalLinks.Instagram,
    LinkIcon: InstagramLogo,
    label: formatText({ id: 'socialLinks.instagram' }),
  },
};
