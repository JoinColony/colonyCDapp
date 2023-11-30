import React, { FC } from 'react';

import SubNavigationItem from '~v5/shared/SubNavigationItem';
import { useMembersSubNavigation } from '~v5/shared/SubNavigationItem/hooks';
import { useMemberModalContext } from '~context/MemberModalContext';
import { formatText } from '~utils/intl';

import { SubNavigationProps } from '../types';

const displayName = 'v5.CardWithBios.partials.SubNavigation';

const SubNavigation: FC<SubNavigationProps> = ({
  shouldPermissionsCanBeChanged = false,
  user,
}) => {
  const { setIsMemberModalOpen, setUser } = useMemberModalContext();
  const { handleClick, isCopyTriggered } = useMembersSubNavigation();

  return (
    <>
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
      </ul>
      <span className="divider my-3 mx-3.5 w-[calc(100%-1.75rem)]" />
      <ul>
        <SubNavigationItem
          iconName="copy-simple"
          title="members.subnav.copy.wallet.address"
          shouldBeTooltipVisible
          tooltipText={formatText({ id: 'copied' })}
          isCopyTriggered={isCopyTriggered}
          onClick={handleClick}
        />
      </ul>
    </>
  );
};

SubNavigation.displayName = displayName;

export default SubNavigation;
