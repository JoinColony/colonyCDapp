import React from 'react';
import { object, string } from 'yup';
import {
  GlobeHemisphereEast,
  Scroll,
  YoutubeLogo,
  DiscordLogo,
  TwitterLogo,
  TelegramLogo,
  GithubLogo,
  InstagramLogo,
  FacebookLogo,
} from 'phosphor-react';
import clsx from 'clsx';
import { TileRadioButtonItem } from '~v5/common/Fields/RadioButtons/TileRadioButtons/types';
import { ExternalLinks } from '~gql';
import { formatText } from '~utils/intl';

export const SOCIAL_LINK_FORM_MODAL_VALIDATION_SCHEMA = object()
  .shape({
    linkType: string().oneOf(Object.values(ExternalLinks)).required(),
    url: string()
      .url(formatText({ id: 'editColony.socialLinks.modal.invalidUrl' }))
      .required(formatText({ id: 'editColony.socialLinks.modal.requiredUrl' })),
  })
  .defined();

export const LINK_TYPE_TO_LABEL_MAP: Record<ExternalLinks, string | undefined> =
  {
    [ExternalLinks.Custom]: formatText({ id: 'editColony.socialLinks.custom' }),
    [ExternalLinks.Whitepaper]: formatText({
      id: 'editColony.socialLinks.whitepaper',
    }),
    [ExternalLinks.Youtube]: formatText({
      id: 'editColony.socialLinks.youtube',
    }),
    [ExternalLinks.Discord]: formatText({
      id: 'editColony.socialLinks.discord',
    }),
    [ExternalLinks.Twitter]: formatText({
      id: 'editColony.socialLinks.twitter',
    }),
    [ExternalLinks.Telegram]: formatText({
      id: 'editColony.socialLinks.telegram',
    }),
    [ExternalLinks.Github]: formatText({ id: 'editColony.socialLinks.github' }),
    [ExternalLinks.Instagram]: formatText({
      id: 'editColony.socialLinks.instagram',
    }),
    [ExternalLinks.Facebook]: formatText({
      id: 'editColony.socialLinks.facebook',
    }),
  };

export const LINK_TYPE_RADIO_BUTTONS: TileRadioButtonItem<ExternalLinks>[] = [
  {
    id: ExternalLinks.Custom,
    label: ExternalLinks.Custom,
    value: ExternalLinks.Custom,
    icon: <GlobeHemisphereEast size={18} />,
  },
  {
    id: ExternalLinks.Whitepaper,
    label: ExternalLinks.Whitepaper,
    icon: ({ checked }) => (
      <Scroll size={18} className={clsx({ 'text-success-400': !checked })} />
    ),
    value: ExternalLinks.Whitepaper,
  },
  {
    id: ExternalLinks.Youtube,
    label: ExternalLinks.Youtube,
    icon: ({ checked }) => (
      <YoutubeLogo
        size={18}
        className={clsx({ 'text-negative-400': !checked })}
      />
    ),
    value: ExternalLinks.Youtube,
  },
  {
    id: ExternalLinks.Discord,
    label: ExternalLinks.Discord,
    icon: ({ checked }) => (
      <DiscordLogo
        size={18}
        className={clsx({ 'text-purple-400': !checked })}
      />
    ),
    value: ExternalLinks.Discord,
  },
  {
    id: ExternalLinks.Twitter,
    label: ExternalLinks.Twitter,
    icon: ({ checked }) => (
      <TwitterLogo size={18} className={clsx({ 'text-[#91D2FA]': !checked })} />
    ),
    value: ExternalLinks.Twitter,
  },
  {
    id: ExternalLinks.Telegram,
    label: ExternalLinks.Telegram,
    icon: ({ checked }) => (
      <TelegramLogo size={18} className={clsx({ 'text-blue-300': !checked })} />
    ),
    value: ExternalLinks.Telegram,
  },
  {
    id: ExternalLinks.Github,
    label: ExternalLinks.Github,
    icon: <GithubLogo size={18} />,
    value: ExternalLinks.Github,
  },
  {
    id: ExternalLinks.Facebook,
    label: ExternalLinks.Facebook,
    icon: ({ checked }) => (
      <FacebookLogo size={18} className={clsx({ 'text-blue-400': !checked })} />
    ),
    value: ExternalLinks.Facebook,
  },
  {
    id: ExternalLinks.Instagram,
    label: ExternalLinks.Instagram,
    icon: ({ checked }) => (
      <InstagramLogo
        size={18}
        className={clsx({ 'text-indigo-400': !checked })}
      />
    ),
    value: ExternalLinks.Instagram,
  },
];
