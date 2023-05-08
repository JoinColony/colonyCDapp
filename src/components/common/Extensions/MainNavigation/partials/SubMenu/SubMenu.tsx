import React from 'react';

import { SubMenuProps } from './types';
import LearnMore from '~shared/Extensions/LearnMore/LearnMore';
import { LEARN_MORE_PAYMENTS } from '~constants';

const displayName = 'common.Extensions.MainNavigation.partials.SubMenu';

const SubMenu: React.FC<SubMenuProps> = ({ items }) => (
  //   <Card>
  <div className="w-[39.75rem]">
    <ul className="grid grid-cols-3 gap-x-6 gap-y-5">
      {items.map(({ label, href, description }) => (
        <li key={label}>
          <a {...{ href }}>
            {label} {description}
          </a>
        </li>
      ))}
    </ul>
    <LearnMore
      message={{ id: `${displayName}.helpText`, defaultMessage: 'Need help and guidance? <a>Visit our docs</a>' }}
      href={LEARN_MORE_PAYMENTS}
    />
  </div>
  //   </Card>
);

SubMenu.displayName = displayName;

export default SubMenu;
