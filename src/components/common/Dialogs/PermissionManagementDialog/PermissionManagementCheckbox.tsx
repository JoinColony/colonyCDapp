import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ColonyRole, Id } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import { HookFormCheckbox as Checkbox } from '~shared/Fields';
import PermissionsLabel from '~shared/PermissionsLabel';
import { formatText } from '~utils/intl';

import styles from './PermissionManagementCheckbox.css';

const displayName = `common.PermissionManagementDialog.PermissionManagementForm.PermissionManagementCheckbox`;

const MSG = defineMessages({
  roleWithAsterisk: {
    id: `${displayName}.roleWithAsterisk`,
    defaultMessage: '{role}{asterisk, select, true {*} false {} }',
  },
  roleDescription0: {
    id: `${displayName}.roleDescription0`,
    defaultMessage: `Disable colony in emergency, update storage, and approve reactivation.`,
  },
  roleDescription1: {
    id: `${displayName}.roleDescription1`,
    defaultMessage: 'Take actions effecting the colony as a whole.',
  },
  roleDescription2: {
    id: `${displayName}.roleDescription2`,
    defaultMessage: `Arbitration allows you to resolve disputes, make state changes, and punish bad behavior.`,
  },
  roleDescription3: {
    id: `${displayName}.roleDescription3`,
    defaultMessage: 'Create teams and manage permissions in sub-teams.',
  },
  // We don't have architecture_subdomain (which would be 4)
  roleDescription5: {
    id: `${displayName}.roleDescription5`,
    defaultMessage: 'Fund expenditures and transfer funds between teams.',
  },
  roleDescription6: {
    id: `${displayName}.roleDescription6`,
    defaultMessage: 'Create and manage expenditures.',
  },
  tooltipNoPermissionsText: {
    id: `${displayName}.tooltipNoPermissionsText`,
    defaultMessage: 'You do not have permission to set the {roleName} role.',
  },
  tooltipNoRootDomainSelected: {
    id: `${displayName}.tooltipNoRootDomainSelected`,
    defaultMessage: 'Switch team to Root to set the root role.',
  },
});

interface Props {
  asterisk: boolean;
  readOnly: boolean;
  disabled: boolean;
  role: ColonyRole;
  domainId: number;
  dataTest: string;
}

const PermissionManagementCheckbox = ({ asterisk, readOnly, disabled, role, domainId, dataTest }: Props) => {
  const { watch } = useFormContext();
  const user = watch('user');

  const roleNameMessage = { id: `role.${role}` };
  const roleDescriptionMessage = MSG[`roleDescription${role}`] || {
    id: '',
    defaultMessage: '',
  };

  const formattedRole = formatText(roleNameMessage);

  const tooltipText =
    domainId !== Id.RootDomain && formattedRole === 'Root'
      ? MSG.tooltipNoRootDomainSelected
      : MSG.tooltipNoPermissionsText;

  const formattedTooltipText = formatText(tooltipText, {
    roleName: formattedRole?.toLowerCase(),
  });

  return (
    <Checkbox
      className={styles.permissionChoice}
      value={role.toString()}
      name="roles"
      readOnly={readOnly}
      disabled={disabled}
      tooltipText={user ? formattedTooltipText : undefined}
      tooltipPopperOptions={{
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 12],
            },
          },
          {
            name: 'preventOverflow',
            options: {
              padding: 14,
            },
          },
        ],
      }}
      dataTest={dataTest}
    >
      <span className={styles.permissionChoiceDescription}>
        <PermissionsLabel permission={role} name={formattedRole} inherited={asterisk} />
        <FormattedMessage {...roleDescriptionMessage} />
      </span>
    </Checkbox>
  );
};

PermissionManagementCheckbox.displayName = displayName;

export default PermissionManagementCheckbox;
