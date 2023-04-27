import React, { useCallback, useEffect, useMemo } from 'react';
import { defineMessages } from 'react-intl';
import { ColonyRole, Id } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import {
  InputLabel,
  HookFormSelect as Select,
  Annotations,
} from '~shared/Fields';
import {
  ActionDialogProps,
  DialogControls,
  DialogHeading,
  DialogSection,
} from '~shared/Dialog';
import SingleUserPicker, {
  filterUserSelection,
} from '~shared/SingleUserPicker';
import { ItemDataType } from '~shared/OmniPicker';
import UserAvatar from '~shared/UserAvatar';

import { User } from '~types';
import { notNull } from '~utils/arrays';
// import { getAllUserRolesForDomain } from '~redux/transformers';
import { findDomainByNativeId, getDomainOptions } from '~utils/domains';

import {
  CannotCreateMotionMessage,
  NoPermissionMessage,
  PermissionRequiredInfo,
} from '../Messages';

import { availableRoles } from './constants';
import PermissionManagementCheckbox from './PermissionManagementCheckbox';

import {
  useCanRoleBeSet,
  usePermissionManagementDialogStatus,
  useSelectedUserRoles,
  formatRolesForForm,
} from './helpers';

import styles from './PermissionManagementDialogForm.css';

const displayName = `common.PermissionManagementDialog.PermissionManagementForm`;

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Permissions',
  },
  domain: {
    id: `${displayName}.domain`,
    defaultMessage: 'Team',
  },
  permissionsLabel: {
    id: `${displayName}.permissionsLabel`,
    defaultMessage: 'Permissions',
  },
  annotation: {
    id: `${displayName}.annotation`,
    defaultMessage: `Explain why you're making these changes (optional)`,
  },
  selectUser: {
    id: `${displayName}.selectUser`,
    defaultMessage: 'Member',
  },
  userPickerPlaceholder: {
    id: `${displayName}.userPickerPlaceholder`,
    defaultMessage: 'Search for a user or paste wallet address',
  },
});

interface Props extends ActionDialogProps {
  close: (val: any) => void;
  users: User[];
}

const supRenderAvatar = (item: ItemDataType<User>) => (
  <UserAvatar user={item} size="xs" />
);

const PermissionManagementForm = ({
  colony: { domains },
  colony,
  back,
  close,
  // enabledExtensionData,
  users,
}: Props) => {
  const { watch, setValue } = useFormContext();
  const {
    domainId: selectedDomainId,
    user: selectedUser,
    motionDomainId,
  } = watch();

  // const colonyWatchers =
  //   watchers?.items
  //     .filter(notNull)
  //     .map((item) => ({ ...item.user, id: item.user.walletAddress })) || [];

  const colonyDomains = domains?.items.filter(notNull) || [];
  const domain = findDomainByNativeId(selectedDomainId, colony);

  const userRoles = useSelectedUserRoles(colony, selectedUser?.walletAddress);

  useEffect(() => {
    setValue('roles', formatRolesForForm(userRoles, selectedDomainId));
  }, [selectedDomainId, setValue, userRoles]);

  const requiredRoles = [
    selectedDomainId === Id.RootDomain ? ColonyRole.Root : ColonyRole.Architecture,
  ];

  const canRoleBeSet = useCanRoleBeSet(colony);

  // const { userHasPermission, canCreateMotion, disabledInput, disabledSubmit } =
  //   usePermissionManagementDialogStatus(
  //     colony,
  //     requiredRoles,
  //     enabledExtensionData,
  //     defaultSelectedUserRoles,
  //   );

  // const domainRoles = useTransformer(getAllUserRolesForDomain, [
  //   colony,
  //   domainId,
  // ]);

  // const directDomainRoles = useTransformer(getAllUserRolesForDomain, [
  //   colony,
  //   domainId,
  //   true,
  // ]);

  const domainSelectOptions = getDomainOptions(colonyDomains);

  // const domainRolesArray = useMemo(
  //   () =>
  //     domainRoles
  //       .sort(({ roles }) => (roles.includes(ColonyRole.Root) ? -1 : 1))
  //       .filter(({ roles }) => !!roles.length)
  //       .map(({ address, roles }) => {
  //         const directUserRoles = directDomainRoles.find(
  //           ({ address: userAddress }) => userAddress === address,
  //         );
  //         return {
  //           userAddress: address,
  //           roles,
  //           directRoles: directUserRoles ? directUserRoles.roles : [],
  //         };
  //       }),
  //   [directDomainRoles, domainRoles],
  // );

  // const members = colonyWatchers.map((colonyUser) => {
  //   // const {
  //   //   profile: { walletAddress },
  //   // } = user;
  //   // const domainRole = domainRolesArray.find(
  //   //   (rolesObject) => rolesObject.userAddress === walletAddress,
  //   // );
  //   return {
  //     ...colonyUser,
  //     roles: [], // domainRole ? domainRole.roles : [],
  //     directRoles: [], // domainRole ? domainRole.directRoles : [],
  //   };
  // });

  const handleDomainChange = (domainValue: number) => {
    setValue('domainId', domainValue);
    if (motionDomainId !== domainValue) {
      setValue('motionDomainId', domainValue);
    }
  };

  const filteredRoles =
    selectedDomainId !== Id.RootDomain
      ? availableRoles.filter(
          /*
           * Can't set recovery and root on a subdomain
           * They can only be inherited in subdomains
           */
          (role) => role !== ColonyRole.Root && role !== ColonyRole.Recovery,
        )
      : availableRoles;

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <DialogHeading
          title={MSG.title}
          titleValues={{ domain: domain?.metadata?.name }}
        />
      </DialogSection>
      {/* {!userHasPermission && (
        <DialogSection>
          <PermissionRequiredInfo requiredRoles={requiredRoles} />
        </DialogSection>
      )} */}
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.singleUserContainer}>
          <SingleUserPicker
            data={users}
            label={MSG.selectUser}
            name="user"
            filter={filterUserSelection}
            renderAvatar={supRenderAvatar}
            // disabled={disabledInput}
            placeholder={MSG.userPickerPlaceholder}
            dataTest="permissionUserSelector"
            itemDataTest="permissionUserSelectorItem"
          />
        </div>
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.domainSelectContainer}>
          <Select
            options={domainSelectOptions}
            label={MSG.domain}
            name="domainId"
            appearance={{ theme: 'grey' }}
            onChange={handleDomainChange}
          />
        </div>
        <InputLabel
          label={MSG.permissionsLabel}
          appearance={{ colorSchema: 'grey' }}
        />
        <div className={styles.permissionChoiceContainer}>
          {filteredRoles.map((role) => {
            const directRole = userRoles?.direct?.[selectedDomainId]?.[role];
            const inheritedRole =
              userRoles?.inherited?.[selectedDomainId]?.[role];
            // const roleIsInherited =
            //   !selectedUserDirectRoles.includes(role) &&
            //   selectedUserInheritedRoles.includes(role);
            return (
              <PermissionManagementCheckbox
                key={role}
                // readOnly={!canRoleBeSet(role) || roleIsInherited}
                readOnly={(inheritedRole && !directRole) || !canRoleBeSet(role)}
                // disabled={disabledInput || !user}
                role={role}
                asterisk={inheritedRole}
                domainId={selectedDomainId}
                dataTest="permission"
              />
            );
          })}
        </div>
        <Annotations
          label={MSG.annotation}
          name="annotationMessage"
          // disabled={disabledInput}
          dataTest="permissionAnnotation"
        />
      </DialogSection>
      {/* {!canCreateMotion && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <CannotCreateMotionMessage />
        </DialogSection>
      )}
      {!userHasPermission && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <NoPermissionMessage
            requiredPermissions={[ColonyRole.Architecture]}
          />
        </DialogSection>
      )} */}
      {/* {onlyForceAction && (
        <NotEnoughReputation domainId={Number(domainId)} />
      )} */}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <DialogControls
          // disabled={disabledSubmit}
          dataTest="permissionConfirmButton"
          onSecondaryButtonClick={back ?? close}
          secondaryButtonText={{
            id: back ? 'button.back' : 'button.cancel',
          }}
        />
      </DialogSection>
    </>
  );
};

export default PermissionManagementForm;
