import {
  Bug,
  DiscordLogo,
  Lifebuoy,
  Star,
  TwitterLogo,
} from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { COLONY_DISCORD, COLONY_DOCS, COLONY_TWITTER } from '~constants';
import { openFeaturesBugs, openWhatsNew } from '~hooks/useBeamer';
import useMobile from '~hooks/useMobile';
import ExternalLink from '~shared/ExternalLink';
import { formatText } from '~utils/intl';

import { ICON_SIZE, ICON_SIZE_MOBILE } from '../consts';
import MenuList from '../MenuList';
import MenuListItem from '../MenuListItem';

import styles from '../Submenu.module.css';

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
        <ExternalLink href={COLONY_DOCS} className={styles.actionItem}>
          <Lifebuoy size={iconSize} />
          <p className={styles.actionItemLabel}>{formatText(MSG.getHelp)}</p>
        </ExternalLink>
      </MenuListItem>
      <MenuListItem>
        <button
          type="button"
          onClick={openWhatsNew}
          className={styles.actionItem}
        >
          <Star size={iconSize} />
          <p className={styles.actionItemLabel}>{formatText(MSG.whatsNew)}</p>
        </button>
      </MenuListItem>
      <MenuListItem>
        <button
          type="button"
          onClick={openFeaturesBugs}
          className={styles.actionItem}
        >
          <Bug size={iconSize} />
          <p className={styles.actionItemLabel}>
            {formatText(MSG.featureBugs)}
          </p>
        </button>
      </MenuListItem>
      <MenuListItem>
        <ExternalLink href={COLONY_DISCORD} className={styles.actionItem}>
          <DiscordLogo size={iconSize} />
          <p className={styles.actionItemLabel}>{formatText(MSG.discord)}</p>
        </ExternalLink>
      </MenuListItem>
      <MenuListItem>
        <ExternalLink href={COLONY_TWITTER} className={styles.actionItem}>
          <TwitterLogo size={iconSize} />
          <p className={styles.actionItemLabel}>{formatText(MSG.twitter)}</p>
        </ExternalLink>
      </MenuListItem>
    </MenuList>
  );
};

Contact.displayName = displayName;
export default Contact;
