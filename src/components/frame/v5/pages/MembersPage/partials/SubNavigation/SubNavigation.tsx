import React, { FC } from 'react';

import SubNavigationItem from '~v5/shared/SubNavigationItem';
import { SubNavigationProps } from './types';
import { useMembersSubNavigation } from '~v5/shared/SubNavigationItem/hooks';

const displayName = 'v5.pages.MembersPage.partials.SubNavigation';

const SubNavigation: FC<SubNavigationProps> = ({ onManageMembersClick }) => {
  const { handleClick, isCopyTriggered } = useMembersSubNavigation();

  return (
    <ul>
      <SubNavigationItem
        iconName="share-network"
        title="members.subnav.invite"
        shouldBeTooltipVisible
        tooltipText={['copiedColony', 'copyColony']}
        onClick={handleClick}
        isCopyTriggered={isCopyTriggered}
      />
      <SubNavigationItem
        iconName="lock-key"
        title="members.subnav.permissions"
      />
      <SubNavigationItem
        iconName="pencil"
        title="members.subnav.manage"
        onClick={onManageMembersClick}
      />
      <SubNavigationItem
        iconName="address-book"
        title="members.subnav.verified"
      />
    </ul>
  );
};

SubNavigation.displayName = displayName;

export default SubNavigation;
