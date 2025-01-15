import { Bug, DiscordLogo, Lifebuoy, Star, XLogo } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { COLONY_DISCORD, COLONY_DOCS, COLONY_X } from '~constants/index.ts';
import { useMobile } from '~hooks/index.ts';
import { openFeaturesBugs, openWhatsNew } from '~hooks/useBeamer.ts';
import ExternalLink from '~shared/ExternalLink/index.ts';
import { formatText } from '~utils/intl.ts';

import { ICON_SIZE, ICON_SIZE_MOBILE } from '../consts.ts';
import MenuList from '../MenuList/index.ts';
import MenuListItem from '../MenuListItem/index.ts';
import { actionItemClass, actionItemLabelClass } from '../submenu.styles.ts';

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
  x: {
    id: `${displayName}.X`,
    defaultMessage: 'X',
  },
});

const Contact = () => {
  const isMobile = useMobile();
  const iconSize = isMobile ? ICON_SIZE_MOBILE : ICON_SIZE;

  return (
    <MenuList>
      <MenuListItem>
        <ExternalLink href={COLONY_DOCS} className={actionItemClass}>
          <Lifebuoy size={iconSize} />
          <p className={actionItemLabelClass}>{formatText(MSG.getHelp)}</p>
        </ExternalLink>
      </MenuListItem>
      <MenuListItem>
        <button
          type="button"
          onClick={openWhatsNew}
          className={actionItemClass}
        >
          <Star size={iconSize} />
          <p className={actionItemLabelClass}>{formatText(MSG.whatsNew)}</p>
        </button>
      </MenuListItem>
      <MenuListItem>
        <button
          type="button"
          onClick={openFeaturesBugs}
          className={actionItemClass}
        >
          <Bug size={iconSize} />
          <p className={actionItemLabelClass}>{formatText(MSG.featureBugs)}</p>
        </button>
      </MenuListItem>
      <MenuListItem>
        <ExternalLink href={COLONY_DISCORD} className={actionItemClass}>
          <DiscordLogo size={iconSize} />
          <p className={actionItemLabelClass}>{formatText(MSG.discord)}</p>
        </ExternalLink>
      </MenuListItem>
      <MenuListItem>
        <ExternalLink href={COLONY_X} className={actionItemClass}>
          <XLogo size={iconSize} />
          <p className={actionItemLabelClass}>{formatText(MSG.x)}</p>
        </ExternalLink>
      </MenuListItem>
    </MenuList>
  );
};

Contact.displayName = displayName;
export default Contact;
