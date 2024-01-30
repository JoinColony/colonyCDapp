import { Code, GithubLogo } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { COLONY_DEV_DOCS, COLONY_GITHUB } from '~constants/index.ts';
import { useMobile } from '~hooks/index.ts';
import ExternalLink from '~shared/ExternalLink/index.ts';
import { formatText } from '~utils/intl.ts';

import { ICON_SIZE, ICON_SIZE_MOBILE } from '../consts.ts';
import MenuList from '../MenuList/index.ts';
import MenuListItem from '../MenuListItem/index.ts';

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
        <ExternalLink href={COLONY_DEV_DOCS}>
          <Code size={iconSize} />
          <p className="ml-2">{formatText(MSG.developerDocs)}</p>
        </ExternalLink>
      </MenuListItem>
      <MenuListItem>
        <ExternalLink href={COLONY_GITHUB}>
          <GithubLogo size={iconSize} />
          <p className="ml-2">{formatText(MSG.github)}</p>
        </ExternalLink>
      </MenuListItem>
    </MenuList>
  );
};

Developers.displayName = displayName;
export default Developers;
