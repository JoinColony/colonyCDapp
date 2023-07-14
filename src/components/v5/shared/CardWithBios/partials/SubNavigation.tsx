import React, { FC } from 'react';

import SubNavigationItem from '~v5/shared/SubNavigationItem';
import { SubNavigationProps } from '../types';
import { useMembersSubNavigation } from '~v5/shared/SubNavigationItem/hooks';

const displayName = 'v5.CardWithBios.partials.SubNavigation';

const SubNavigation: FC<SubNavigationProps> = ({
  shouldPermissionsCanBeChanged = false,
}) => {
  const { handleClick, isCopyTriggered } = useMembersSubNavigation();

  return (
    <ul>
      <SubNavigationItem iconName="pencil" title="members.subnav.manage" />
      <SubNavigationItem
        iconName="eye"
        title="members.subnav.members.profile"
      />
      {shouldPermissionsCanBeChanged && (
        <SubNavigationItem
          iconName="lock-key"
          title="members.subnav.members.persmissions"
        />
      )}
      <SubNavigationItem
        iconName="hand-coins"
        title="members.subnav.make.payment"
      />
      <SubNavigationItem
        iconName="arrow-square-out"
        title="members.subnav.gnosis.scan"
      />
      <span className="block h-px bg-gray-200 m-2" />
      <SubNavigationItem
        iconName="copy-simple"
        title="members.subnav.copy.wallet.address"
        shouldBeTooltipVisible
        tooltipText={['copied', 'copy']}
        isCopyTriggered={isCopyTriggered}
        onClick={handleClick}
      />
    </ul>
  );
};

SubNavigation.displayName = displayName;

export default SubNavigation;
