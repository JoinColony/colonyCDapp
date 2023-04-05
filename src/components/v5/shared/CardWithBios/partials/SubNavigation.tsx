import React, { FC } from 'react';

import SubNavigationItem from '~v5/shared/SubNavigationItem';
import { SubNavigationProps } from '../types';
import { useMemberContext } from '~context/MemberContext';
import { useMembersSubNavigation } from '~v5/shared/SubNavigationItem/hooks';

const displayName = 'v5.CardWithBios.partials.SubNavigation';

const SubNavigation: FC<SubNavigationProps> = ({
  shouldPermissionsCanBeChanged = false,
  user,
}) => {
  const { setIsMemberModalOpen, setUser } = useMemberContext();
  const { handleClick, isCopyTriggered } = useMembersSubNavigation();

  return (
    <ul>
      <SubNavigationItem
        iconName="pencil"
        title="members.subnav.manage"
        onClick={() => {
          setIsMemberModalOpen(true);
          setUser(user);
        }}
      />
      <SubNavigationItem
        iconName="eye"
        title="members.subnav.members.profile"
      />
      {shouldPermissionsCanBeChanged && (
        <SubNavigationItem
          iconName="lock-key"
          title="members.subnav.members.permissions"
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
      <span className="divider m-2" />
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
