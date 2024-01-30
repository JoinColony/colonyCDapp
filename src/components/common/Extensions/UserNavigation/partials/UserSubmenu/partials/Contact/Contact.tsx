import {
  Bug,
  DiscordLogo,
  Lifebuoy,
  Star,
  TwitterLogo,
} from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

import {
  COLONY_DISCORD,
  COLONY_DOCS,
  COLONY_TWITTER,
} from '~constants/index.ts';
import { useMobile } from '~hooks/index.ts';
import { openFeaturesBugs, openWhatsNew } from '~hooks/useBeamer.ts';
import ExternalLink from '~shared/ExternalLink/index.ts';
import { formatText } from '~utils/intl.ts';

import { ICON_SIZE, ICON_SIZE_MOBILE } from '../consts.ts';
import MenuList from '../MenuList/index.ts';
import MenuListItem from '../MenuListItem/index.ts';

const displayName =
  'common.Extensions.UserNavigation.partials.UserSubmenu.partials.Contact';

const MSG = defineMessages({
  getHelp: {
    id: `${displayName}.getHelp`,
    defaultMessage: 'Get help',
  },
  whatsNew: {
    id: `${displayName}.whatsNew`,
    defaultMessage: "What's new",
  },
  featureBugs: {
    id: `${displayName}.featuresBugs`,
    defaultMessage: 'Features & Bugs',
  },
  discord: {
    id: `${displayName}.discord`,
    defaultMessage: 'Discord',
  },
  twitter: {
    id: `${displayName}.twitter`,
    defaultMessage: 'Twitter',
  },
});

const Contact = () => {
  const isMobile = useMobile();
  const iconSize = isMobile ? ICON_SIZE_MOBILE : ICON_SIZE;

  return (
    <MenuList>
      <MenuListItem>
        <ExternalLink href={COLONY_DOCS}>
          <Lifebuoy size={iconSize} />
          <p className="ml-2">{formatText(MSG.getHelp)}</p>
        </ExternalLink>
      </MenuListItem>
      <MenuListItem>
        <button type="button" onClick={openWhatsNew}>
          <Star size={iconSize} />
          <p className="ml-2">{formatText(MSG.whatsNew)}</p>
        </button>
      </MenuListItem>
      <MenuListItem>
        <button type="button" onClick={openFeaturesBugs}>
          <Bug size={iconSize} />
          <p className="ml-2">{formatText(MSG.featureBugs)}</p>
        </button>
      </MenuListItem>
      <MenuListItem>
        <ExternalLink href={COLONY_DISCORD}>
          <DiscordLogo size={iconSize} />
          <p className="ml-2">{formatText(MSG.discord)}</p>
        </ExternalLink>
      </MenuListItem>
      <MenuListItem>
        <ExternalLink href={COLONY_TWITTER}>
          <TwitterLogo size={iconSize} />
          <p className="ml-2">{formatText(MSG.twitter)}</p>
        </ExternalLink>
      </MenuListItem>
    </MenuList>
  );
};

Contact.displayName = displayName;
export default Contact;
