import React, { FC } from 'react';

import Tooltip from '~shared/Extensions/Tooltip';
import Link from '~v5/shared/Link';
import DropdownMenu from '~v5/common/DropdownMenu';

import { ColonyLinksProps } from './types';

const displayName = 'v5.common.ColonyDashboardHeader.partials.ColonyLinks';

const ColonyLinks: FC<ColonyLinksProps> = ({ items, dropdownMenuProps }) => {
  const itemClassName =
    'flex items-center transition-all md:hover:text-blue-400';

  return (
    <ul className="flex items-center gap-4">
      {items.map(({ key, to, tooltipProps, icon: Icon, label, onClick }) => {
        const content = label ? (
          <>
            <Icon />
            {label}
          </>
        ) : (
          <Icon />
        );

        const item = to ? (
          <Link to={to} onClick={onClick} className={itemClassName}>
            {content}
          </Link>
        ) : (
          <button type="button" onClick={onClick} className={itemClassName}>
            {content}
          </button>
        );

        return (
          <li key={key}>
            {tooltipProps ? <Tooltip {...tooltipProps}>{item}</Tooltip> : item}
          </li>
        );
      })}
      <li>
        <DropdownMenu {...dropdownMenuProps} />
      </li>
    </ul>
  );
};

ColonyLinks.displayName = displayName;

export default ColonyLinks;
