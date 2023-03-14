import React, { useEffect, useMemo } from 'react';
import { defineMessages } from 'react-intl'; // FormattedMessage
import { ColonyRole, Id } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import { InputLabel, Select, Annotations } from '~shared/Fields';
import {
  ActionDialogProps,
  DialogControls,
  DialogHeading,
  DialogSection,
} from '~shared/Dialog';
import PermissionRequiredInfo from '~shared/PermissionRequiredInfo';
import SingleUserPicker, {
  filterUserSelection,
} from '~shared/SingleUserPicker';
import { ItemDataType } from '~shared/OmniPicker';
import UserAvatar from '~shared/UserAvatar';
import NoPermissionMessage from '~shared/NoPermissionMessage';
import {
  useAppContext,
  useDialogActionPermissions,
  useEnabledExtensions,
  useTransformer,
} from '~hooks';
import { getAllRootAccounts, getUserRolesForDomain } from '~redux/transformers';

import { User } from '~types';
import { notNull } from '~utils/arrays';
// import { getAllUserRolesForDomain } from '~redux/transformers';
import { isEqual, sortBy } from '~utils/lodash';

import { availableRoles } from './constants';
import PermissionManagementCheckbox from './PermissionManagementCheckbox';

import { useSelectedUserRoles } from './helpers';

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
    defaultMessage: 'Explain why you’re making these changes (optional)',
  },
  selectUser: {
    id: `${displayName}.selectUser`,
    defaultMessage: 'Member',
  },
  userPickerPlaceholder: {
    id: `${displayName}.userPickerPlaceholder`,
    defaultMessage: 'Search for a user or paste wallet address',
  },
  cannotCreateMotion: {
    id: `${displayName}.cannotCreateMotion`,
    defaultMessage: `Cannot create motions using the Governance v{version} Extension. Please upgrade to a newer version (when available)`,
  },
});

interface Props extends ActionDialogProps {
  close: (val: any) => void;
}

const supRenderAvatar = (item: ItemDataType<User>) => (
  <UserAvatar user={item} size="xs" />
);

const PermissionManagementForm = ({
  colony: { watchers, domains },
  colony,
  back,
  close,
}: Props) => {
  const {
    formState: { isValid, isSubmitting },
    getValues,
    setValue,
  } = useFormContext();
  const { user: currentUser } = useAppContext();
  const {
    // votingExtensionVersion,
    enabledExtensions: { isVotingReputationEnabled },
  } = useEnabledExtensions();

  const values = getValues();
  const colonyWatchers =
    watchers?.items
      .filter(notNull)
      .map((item) => ({ ...item.user, id: item.user.walletAddress })) || [];

  const colonyDomains = domains?.items.filter(notNull) || [];
  const domain = colonyDomains.find(
    (colonyDomain) => colonyDomain.nativeId === values.domainId,
  );
  const {
    inheritedRoles: selectedUserInheritedRoles,
    directRoles: selectedUserDirectRoles,
  } = useSelectedUserRoles(colony, values.user, values.domainId);
  const defaultSelectedUserRoles = useMemo(
    () =>
      [
        ...new Set([...selectedUserDirectRoles, ...selectedUserInheritedRoles]),
      ].map((role) => role.toString()),
    [selectedUserDirectRoles, selectedUserInheritedRoles],
  );

  useEffect(() => {
    setValue('roles', defaultSelectedUserRoles);
  }, [defaultSelectedUserRoles]);

  const currentUserRoles = useTransformer(getUserRolesForDomain, [
    colony,
    // CURRENT USER!
    currentUser?.walletAddress,
    values.domainId,
  ]);

  const currentUserRolesInRoot = useTransformer(getUserRolesForDomain, [
    colony,
    currentUser?.walletAddress,
    Id.RootDomain,
  ]);

  const rootAccounts = useTransformer(getAllRootAccounts, [colony]);

  const canSetPermissionsInRoot =
    values.domainId === Id.RootDomain &&
    currentUserRoles.includes(ColonyRole.Root) &&
    (!selectedUserDirectRoles.includes(ColonyRole.Root) ||
      rootAccounts.length > 1);
  const hasRoot = currentUserRolesInRoot.includes(ColonyRole.Root);
  const hasArchitectureInRoot = currentUserRolesInRoot.includes(
    ColonyRole.Architecture,
  );

  const requiredRoles: ColonyRole[] = [ColonyRole.Architecture];

  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colony,
    !!isVotingReputationEnabled,
    [
      values.domainId === Id.RootDomain
        ? ColonyRole.Root
        : ColonyRole.Architecture,
    ],
    [values.domainId],
  );

  // Check which roles the current user is allowed to set in this domain
  const canRoleBeSet = (role: ColonyRole) => {
    switch (role) {
      case ColonyRole.Arbitration:
        return true;

      // Can only be set by root and in root domain (and only unset if other root accounts exist)
      case ColonyRole.Root:
      case ColonyRole.Recovery:
        return canSetPermissionsInRoot;

      // Must be root for these
      case ColonyRole.Administration:
      case ColonyRole.Funding:
        return hasArchitectureInRoot;

      // Can be set if root domain and has root OR has architecture in parent
      case ColonyRole.Architecture:
        return (
          (values.domainId === Id.RootDomain && hasRoot) ||
          hasArchitectureInRoot
        );

      default:
        return false;
    }
  };

  // const domainRoles = useTransformer(getAllUserRolesForDomain, [
  //   colony,
  //   domainId,
  // ]);

  // const directDomainRoles = useTransformer(getAllUserRolesForDomain, [
  //   colony,
  //   domainId,
  //   true,
  // ]);

  const domainSelectOptions = sortBy(
    colonyDomains.map((colonyDomain) => ({
      value: colonyDomain.nativeId || '',
      label: colonyDomain.metadata?.name || '',
    })),
    ['value'],
  );

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

  const members = colonyWatchers.map((user) => {
    // const {
    //   profile: { walletAddress },
    // } = user;
    // const domainRole = domainRolesArray.find(
    //   (rolesObject) => rolesObject.userAddress === walletAddress,
    // );
    return {
      ...user,
      roles: [], // domainRole ? domainRole.roles : [],
      directRoles: [], // domainRole ? domainRole.directRoles : [],
    };
  });

  const handleDomainChange = (domainValue: number) => {
    setValue('domainId', domainValue);
    if (values.motionDomainId !== domainValue) {
      setValue('motionDomainId', domainValue);
    }
  };

  const filteredRoles =
    values.domainId !== Id.RootDomain
      ? availableRoles.filter(
          (role) => role !== ColonyRole.Root && role !== ColonyRole.Recovery,
        )
      : availableRoles;

  // const cannotCreateMotion =
  //   votingExtensionVersion ===
  //     VotingReputationExtensionVersion.FuchsiaLightweightSpaceship &&
  //   !values.forceAction;
  const inputDisabled = !userHasPermission || onlyForceAction || isSubmitting;

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <DialogHeading
          title={MSG.title}
          titleValues={{ domain: domain?.metadata?.name }}
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection>
          <PermissionRequiredInfo requiredRoles={requiredRoles} />
        </DialogSection>
      )}
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.singleUserContainer}>
          <SingleUserPicker
            data={members}
            label={MSG.selectUser}
            name="user"
            filter={filterUserSelection}
            renderAvatar={supRenderAvatar}
            disabled={inputDisabled}
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
            const roleIsInherited =
              !selectedUserDirectRoles.includes(role) &&
              selectedUserInheritedRoles.includes(role);
            return (
              <PermissionManagementCheckbox
                key={role}
                readOnly={!canRoleBeSet(role) || roleIsInherited}
                disabled={inputDisabled || !values.user}
                role={role}
                asterisk={roleIsInherited}
                domainId={values.domainId}
                dataTest="permission"
              />
            );
          })}
        </div>
        <Annotations
          label={MSG.annotation}
          name="annotationMessage"
          disabled={inputDisabled}
          dataTest="permissionAnnotation"
        />
      </DialogSection>
      {/* {cannotCreateMotion && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.noPermissionFromMessage}>
            <FormattedMessage
              {...MSG.cannotCreateMotion}
              values={{
                version:
                  VotingReputationExtensionVersion.FuchsiaLightweightSpaceship,
              }}
            />
          </div>
        </DialogSection>
      )} */}
      {!userHasPermission && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          \
          <NoPermissionMessage
            requiredPermissions={[ColonyRole.Architecture]}
          />
        </DialogSection>
      )}
      {/* {onlyForceAction && (
        <NotEnoughReputation domainId={Number(values.domainId)} />
      )} */}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <DialogControls
          disabled={
            // (votingExtensionVersion ===
            //   // eslint-disable-next-line max-len
            //   VotingReputationExtensionVersion.FuchsiaLightweightSpaceship &&
            //   !values.forceAction) ||
            inputDisabled ||
            !isValid ||
            isSubmitting ||
            isEqual(sortBy(values.roles), sortBy(defaultSelectedUserRoles))
          }
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
