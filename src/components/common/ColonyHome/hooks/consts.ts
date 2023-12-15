import { ComponentType } from 'react';
import {
  DiscordLogo,
  FacebookLogo,
  GithubLogo,
  Globe,
  IconProps,
  InstagramLogo,
  Scroll,
  TelegramLogo,
  TwitterLogo,
  YoutubeLogo,
} from 'phosphor-react';

import { ExternalLinks } from '~gql';

export const iconMappings: Record<ExternalLinks, ComponentType<IconProps>> = {
  [ExternalLinks.Custom]: Globe,
  [ExternalLinks.Whitepaper]: Scroll,
  [ExternalLinks.Github]: GithubLogo,
  [ExternalLinks.Discord]: DiscordLogo,
  [ExternalLinks.Twitter]: TwitterLogo,
  [ExternalLinks.Telegram]: TelegramLogo,
  [ExternalLinks.Youtube]: YoutubeLogo,
  [ExternalLinks.Facebook]: FacebookLogo,
  [ExternalLinks.Instagram]: InstagramLogo,
};

export const MAX_TEXT_LENGTH = 250;
