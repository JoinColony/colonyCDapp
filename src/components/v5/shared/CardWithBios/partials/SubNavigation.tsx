import {
  ArrowSquareOut,
  CopySimple,
  Eye,
  HandCoins,
  LockKey,
  Pencil,
} from '@phosphor-icons/react';
import React, { type FC } from 'react';

import { useMemberModalContext } from '~context/MemberModalContext.tsx';
import { formatText } from '~utils/intl.ts';
import { useMembersSubNavigation } from '~v5/shared/SubNavigationItem/hooks.ts';
import SubNavigationItem from '~v5/shared/SubNavigationItem/index.ts';

import { type SubNavigationProps } from '../types.ts';

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
          icon={Pencil}
          title="members.subnav.manage"
          onClick={() => {
            setIsMemberModalOpen(true);
            setUser(user);
          }}
        />
        <SubNavigationItem icon={Eye} title="members.subnav.members.profile" />
        {shouldPermissionsCanBeChanged && (
          <SubNavigationItem
            icon={LockKey}
            title="members.subnav.members.permissions"
          />
        )}
        <SubNavigationItem
          icon={HandCoins}
          title="members.subnav.make.payment"
        />
        <SubNavigationItem
          icon={ArrowSquareOut}
          title="members.subnav.gnosis.scan"
        />
      </ul>
      <span className="divider my-3 mx-3.5 w-[calc(100%-1.75rem)]" />
      <ul>
        <SubNavigationItem
          icon={CopySimple}
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
