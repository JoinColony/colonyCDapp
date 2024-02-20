import { LockKey, ShareNetwork } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/index.tsx';
import { formatText } from '~utils/intl.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.tsx';
import { useMembersSubNavigation } from '~v5/shared/SubNavigationItem/hooks.ts';
import SubNavigationItem from '~v5/shared/SubNavigationItem/index.ts';

import { type SubNavigationProps } from './types.ts';

const displayName = 'v5.pages.MembersPage.partials.SubNavigation';

const SubNavigation: FC<SubNavigationProps> = () =>
  // @BETA: Hide for now
  // { onManageMembersClick }
  {
    const { handleClick, isCopyTriggered } = useMembersSubNavigation();
    const {
      actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
    } = useActionSidebarContext();

    return (
      <ul>
        <SubNavigationItem
          icon={ShareNetwork}
          title="members.subnav.invite"
          shouldBeTooltipVisible
          tooltipText={formatText({ id: 'linkCopied' })}
          onClick={handleClick}
          isCopyTriggered={isCopyTriggered}
        />
        <SubNavigationItem
          icon={LockKey}
          title="members.subnav.permissions"
          onClick={() =>
            toggleActionSidebarOn({
              [ACTION_TYPE_FIELD_NAME]: Action.ManagePermissions,
            })
          }
        />
        {/* @BETA: Hide for now */}
        {/* <SubNavigationItem */}
        {/*   icon={Pencil} */}
        {/*   title="members.subnav.manage" */}
        {/*   onClick={onManageMembersClick} */}
        {/* /> */}
        {/* @BETA: Action not ready yet */}
        {/* <SubNavigationItem
        icon={AddressBook}
        title="members.subnav.verified"
      /> */}
      </ul>
    );
  };

SubNavigation.displayName = displayName;

export default SubNavigation;
