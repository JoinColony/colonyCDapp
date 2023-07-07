import React, { FC } from 'react';

import SubNavigationItem from '~v5/shared/SubNavigationItem';

const displayName = 'pages.MembersPage.partials.SubNavigation';

const SubNavigation: FC = () => (
  <ul>
    <SubNavigationItem
      iconName="share-network"
      title="members.subnav.invite"
      shouldBeTooltipVisible
    />
    <SubNavigationItem iconName="lock-key" title="members.subnav.permissions" />
    <SubNavigationItem iconName="pencil" title="members.subnav.manage" />
    <SubNavigationItem
      iconName="address-book"
      title="members.subnav.verified"
    />
  </ul>
);

SubNavigation.displayName = displayName;

export default SubNavigation;
