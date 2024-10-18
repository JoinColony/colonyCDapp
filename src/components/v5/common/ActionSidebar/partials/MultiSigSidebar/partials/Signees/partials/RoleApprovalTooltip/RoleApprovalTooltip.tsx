import { type ColonyRole } from '@colony/colony-js';
import React from 'react';
import { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { MultiSigVote } from '~gql';
import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';
import { getMultipleRolesText } from '~utils/colonyRoles.ts';
import { formatText } from '~utils/intl.ts';

const displayName =
  'v5.common.ActionSidebar.partials.MultiSig.partials.Signees.partials.RoleApprovalTooltip';

interface RoleApprovalTooltipProps {
  vote: MultiSigVote;
  rolesSignedWith: ColonyRole[];
  userRoles: ColonyRole[];
}

const MSG = defineMessages({
  rolesTooltipApproved: {
    id: `${displayName}.rolesTooltipApproved`,
    defaultMessage:
      'Approved using {numberOfRolesSigned} core multi-sig {numberOfRolesSigned, plural, one {permission} other {permissions}}:',
  },
  rolesTooltipRejected: {
    id: `${displayName}.rolesTooltipRejected`,
    defaultMessage:
      'Rejected using {numberOfRolesSigned} core multi-sig {numberOfRolesSigned, plural, one {permission} other {permissions}}:',
  },
  rolesTooltipPending: {
    id: `${displayName}.rolesTooltipPending`,
    defaultMessage:
      'Can approve using {numberOfRolesPending} core multi-sig {numberOfRolesPending, plural, one {permission} other {permissions}}:',
  },
});

const RoleApprovalTooltip: FC<RoleApprovalTooltipProps> = ({
  vote,
  rolesSignedWith,
  userRoles,
}) => {
  if (vote === MultiSigVote.None) {
    const numberOfUserRoles = userRoles.length;

    return (
      <Tooltip
        placement="top"
        tooltipContent={
          <>
            <span>
              {formatText(MSG.rolesTooltipPending, {
                numberOfRolesPending: numberOfUserRoles,
              })}
            </span>
            <span>{getMultipleRolesText(userRoles)}</span>
          </>
        }
      >
        <div className="ml-1 rounded-[2px] bg-gray-100 p-1 text-[.5rem] font-extrabold text-gray-300">
          {numberOfUserRoles}
        </div>
      </Tooltip>
    );
  }

  const numberOfUserRolesVotedWith = rolesSignedWith.length;

  return (
    <Tooltip
      placement="top"
      tooltipContent={
        <>
          <span>
            {formatText(
              vote === MultiSigVote.Approve
                ? MSG.rolesTooltipApproved
                : MSG.rolesTooltipRejected,
              {
                numberOfRolesSigned: numberOfUserRolesVotedWith,
              },
            )}
          </span>
          <span>{getMultipleRolesText(rolesSignedWith)}</span>
        </>
      }
    >
      <div className="ml-1 rounded-[2px] bg-blue-100 p-1 text-[.5rem] font-extrabold text-blue-400">
        {numberOfUserRolesVotedWith}
      </div>
    </Tooltip>
  );
};

RoleApprovalTooltip.displayName = displayName;
export default RoleApprovalTooltip;
