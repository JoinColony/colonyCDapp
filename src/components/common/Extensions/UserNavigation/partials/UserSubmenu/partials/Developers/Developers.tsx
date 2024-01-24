import { Code, GithubLogo } from 'phosphor-react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { COLONY_DEV_DOCS, COLONY_GITHUB } from '~constants';
import { useMobile } from '~hooks';
import ExternalLink from '~shared/ExternalLink';
import { formatText } from '~utils/intl';

import { ICON_SIZE, ICON_SIZE_MOBILE } from '../consts';
import MenuList from '../MenuList';
import MenuListItem from '../MenuListItem';

import styles from '../Submenu.module.css';

const displayName =
  'common.Extensions.UserNavigation.partials.UserSubmenu.partials.Developers';

const MSG = defineMessages({
  developerDocs: {
    id: `${displayName}.developerDocs`,
    defaultMessage: 'Developer docs',
  },
  github: {
    id: `${displayName}.github`,
    defaultMessage: 'Github',
  },
});

const Developers = () => {
  const isMobile = useMobile();
  const iconSize = isMobile ? ICON_SIZE_MOBILE : ICON_SIZE;

  return (
    <MenuList>
      <MenuListItem>
        <ExternalLink href={COLONY_DEV_DOCS} className={styles.actionItem}>
          <Code size={iconSize} />
          <p className={styles.actionItemLabel}>
            {formatText(MSG.developerDocs)}
          </p>
        </ExternalLink>
      </MenuListItem>
      <MenuListItem>
        <ExternalLink href={COLONY_GITHUB} className={styles.actionItem}>
          <GithubLogo size={iconSize} />
          <p className={styles.actionItemLabel}>{formatText(MSG.github)}</p>
        </ExternalLink>
      </MenuListItem>
    </MenuList>
  );
};

Developers.displayName = displayName;
export default Developers;
