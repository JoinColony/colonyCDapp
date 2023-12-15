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
} from '@phosphor-icons/react';

import { DomainColor, ExternalLinks } from '~gql';

export const MAX_TEXT_LENGTH = 250;

export const setTeamColor = (color?: DomainColor) => {
  switch (color) {
    case DomainColor.Aqua:
      return 'bg-teams-yellow-500';
    case DomainColor.Black:
      return 'bg-teams-red-400';
    case DomainColor.Blue:
      return 'bg-teams-red-600';
    case DomainColor.BlueGrey:
      return 'bg-teams-pink-400';
    case DomainColor.EmeraldGreen:
      return 'bg-teams-pink-500';
    case DomainColor.Gold:
      return 'bg-teams-pink-600';
    case DomainColor.Green:
      return 'bg-teams-purple-400';
    case DomainColor.LightPink:
      return 'bg-teams-purple-500';
    case DomainColor.Magenta:
      return 'bg-teams-green-300';
    case DomainColor.Orange:
      return 'bg-teams-green-400';
    case DomainColor.Periwinkle:
      return 'bg-teams-green-500';
    case DomainColor.Pink:
      return 'bg-teams-teal-500';
    case DomainColor.Purple:
      return 'bg-teams-blue-500';
    case DomainColor.PurpleGrey:
      return 'bg-teams-blue-400';
    case DomainColor.Red:
      return 'bg-teams-indigo-500';
    case DomainColor.Yellow:
      return 'bg-teams-grey-500';
    default:
      return 'bg-blue-400';
  }
};

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
