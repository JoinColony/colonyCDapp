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

import { DomainColor, ExternalLinks } from '~gql';

export const MAX_TEXT_LENGTH = 250;

export const setTeamColor = (color?: DomainColor) => {
  switch (color) {
    case DomainColor.Purple:
      return 'bg-teams-purple-400 border-teams-purple-400';
    case DomainColor.LightPink:
      return 'bg-teams-pink-400 border-teams-pink-400';
    case DomainColor.Yellow:
      return 'bg-teams-yellow-500 border-teams-yellow-500';
    case DomainColor.Blue:
      return 'bg-indigo-400 border-indigo-400';
    case DomainColor.Green:
      return 'bg-teams-green-500 border-teams-green-500';
    case DomainColor.Aqua:
      return 'bg-teams-teal-500 border-teams-teal-500';
    case DomainColor.Black:
      return 'bg-teams-grey-500 border-teams-grey-500';
    case DomainColor.BlueGrey:
      return 'bg-teams-grey-100 border-teams-grey-100';
    case DomainColor.EmeraldGreen:
      return 'bg-teams-green-400 border-teams-green-400';
    case DomainColor.Gold:
      return 'bg-teams-yellow-100 border-teams-yellow-100';
    case DomainColor.Magenta:
      return 'bg-teams-pink-600 border-teams-pink-600';
    case DomainColor.Orange:
      return 'bg-teams-red-400 border-teams-red-400';
    case DomainColor.Pink:
      return 'bg-teams-pink-500 border-teams-pink-500';
    case DomainColor.Periwinkle:
      return 'bg-teams-indigo-500 border-teams-indigo-500';
    case DomainColor.PurpleGrey:
      return 'bg-teams-purple-400 border-teams-purple-400';
    case DomainColor.Red:
      return 'bg-teams-red-600 border-teams-red-600';
    default:
      return 'bg-teams-purple-400 border-teams-purple-400';
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
