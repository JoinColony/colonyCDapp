import { Files, FileText } from 'phosphor-react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { PRIVACY_POLICY, TERMS_AND_CONDITIONS } from '~constants/index.ts';
import { useMobile } from '~hooks/index.ts';
import ExternalLink from '~shared/ExternalLink/index.ts';
import { formatText } from '~utils/intl.ts';

import { ICON_SIZE, ICON_SIZE_MOBILE } from '../consts.ts';
import MenuList from '../MenuList/index.ts';
import MenuListItem from '../MenuListItem/index.ts';

import styles from '../Submenu.module.css';

const displayName =
  'common.Extensions.UserNavigation.partials.UserSubmenu.partials.Legal';

const MSG = defineMessages({
  privacyPolicy: {
    id: `${displayName}.privacyPolicy`,
    defaultMessage: 'Privacy policy',
  },
  termsOfUse: {
    id: `${displayName}.termsOfUse`,
    defaultMessage: 'Terms of use',
  },
});

const Legal = () => {
  const isMobile = useMobile();
  const iconSize = isMobile ? ICON_SIZE_MOBILE : ICON_SIZE;

  return (
    <MenuList>
      <MenuListItem>
        <ExternalLink href={PRIVACY_POLICY} className={styles.actionItem}>
          <FileText size={iconSize} />
          <p className={styles.actionItemLabel}>
            {formatText(MSG.privacyPolicy)}
          </p>
        </ExternalLink>
      </MenuListItem>
      <MenuListItem>
        <ExternalLink href={TERMS_AND_CONDITIONS} className={styles.actionItem}>
          <Files size={iconSize} />
          <p className={styles.actionItemLabel}>{formatText(MSG.termsOfUse)}</p>
        </ExternalLink>
      </MenuListItem>
    </MenuList>
  );
};

Legal.displayName = displayName;
export default Legal;
