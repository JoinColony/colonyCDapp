import React from 'react';
import { ColonyRole } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

import { EVENT_ROLES_MAP } from '~common/ColonyActions/ActionsPage';
import PermissionsLabel from '~shared/PermissionsLabel';
import {
  ActionItemType,
  ColonyActions,
  ColonyAndExtensionsEvents,
  ColonyMotions,
} from '~types';

import styles from './ActionsPageEvent.css';

const displayName = 'common.ColonyActions.ActionsPageEvent.ActionRoles';

const MSG = defineMessages({
  rolesTooltip: {
    id: `${displayName}.rolesTooltip`,
    defaultMessage: `{icon} {role, select,
          0 {This permission allows users to put the colony in and out of
            recovery mode, and edit colony state while in recovery.}
          1 {This permission allows you to modify colony-wide parameters, upgrade
            the colony, and manage permissions in the Root Domain.}
          2 {This permission allows you to resolve disputes, make state changes,
            and punish bad behavior.}
          3 {This permission allows users to create new domains, and manage
            permissions within those domains.}
          5 {This permission allows users to transfer funds between domains and
            into expenditures and payments.}
          6 {This permission allows an account to manipulate payments (tasks) in
            their domain and to raise disputes.}
          other {This is a generic placeholder for a permissions type.
            You should not be seeing this}
        }`,
  },
});

const shouldHideLabel = (
  actionType: ColonyActions | ColonyMotions,
  role: ColonyRole,
) => {
  const isSmite = actionType === ColonyActions.EmitDomainReputationPenalty;
  const isAward = actionType === ColonyActions.EmitDomainReputationReward;
  return (
    // If it is a smite action, do not display the Root label
    (isSmite && role === ColonyRole.Root) ||
    // If it is an award action, do not display the Arbitration label
    (isAward && role === ColonyRole.Arbitration)
  );
};

interface PermissionsLabelTooltipIconProps {
  role: ColonyRole;
}
const PermissionsLabelTooltipIcon = ({
  role,
}: PermissionsLabelTooltipIconProps) => (
  <div className={styles.tooltipIcon}>
    <PermissionsLabel permission={role} appearance={{ theme: 'white' }} />
  </div>
);

interface ActionRolesProps {
  actionType: ActionItemType;
  eventName: ColonyAndExtensionsEvents;
}

const ActionRoles = ({ actionType, eventName }: ActionRolesProps) => (
  <div className={styles.roles}>
    {EVENT_ROLES_MAP[eventName]?.map(
      (role: ColonyRole) =>
        !shouldHideLabel(actionType, role) && (
          <PermissionsLabel
            key={role}
            appearance={{ theme: 'simple' }}
            permission={role}
            minimal
            infoMessage={MSG.rolesTooltip}
            infoMessageValues={{
              role,
              icon: <PermissionsLabelTooltipIcon role={role} />,
            }}
          />
        ),
    )}
  </div>
);

ActionRoles.displayName = displayName;

export default ActionRoles;
