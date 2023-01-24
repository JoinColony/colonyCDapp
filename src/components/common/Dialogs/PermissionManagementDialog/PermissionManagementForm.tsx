import React, { useCallback, useMemo } from 'react';
import { defineMessages } from 'react-intl'; // FormattedMessage
import {
  ColonyRole,
  Id,
  // VotingReputationVersion,
} from '@colony/colony-js';
import { FormState } from 'react-hook-form';

import { InputLabel, Select, Annotations } from '~shared/Fields'; // ForceToggle
import { DialogSection } from '~shared/Dialog';
import { Heading3 } from '~shared/Heading';
import PermissionRequiredInfo from '~shared/PermissionRequiredInfo';
import SingleUserPicker, {
  filterUserSelection,
} from '~shared/SingleUserPicker';
import { ItemDataType } from '~shared/OmniPicker';
import UserAvatar from '~shared/UserAvatar';

// import MotionDomainSelect from '~dashboard/MotionDomainSelect';

import { Address, Colony, User } from '~types/index';
import { notNull } from '~utils/arrays';
// import { useTransformer, useEnabledExtensions} from '~hooks';
// import { getAllUserRolesForDomain } from '~redux/transformers';
import { sortBy } from '~utils/lodash';

import { availableRoles } from './constants';
import { FormValues } from './PermissionManagementDialog';
import PermissionManagementCheckbox from './PermissionManagementCheckbox';

import styles from './PermissionManagementDialog.css';

const displayName = `common.ColonyHome.PermissionManagementDialog.PermissionManagementForm`;

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

interface Props {
  colony: Colony;
  currentUserRoles: ColonyRole[];
  domainId: number;
  rootAccounts: Address[];
  userDirectRoles: ColonyRole[];
  currentUserRolesInRoot: ColonyRole[];
  userInheritedRoles: ColonyRole[];
  onDomainSelected: (domain: number) => void;
  onChangeSelectedUser: React.Dispatch<React.SetStateAction<string>>;
  onMotionDomainChange: (domain: number) => void;
  inputDisabled: boolean;
  userHasPermission: boolean;
  values: FormValues;
}

const supRenderAvatar = (address: string, item: ItemDataType<User>) => (
  <UserAvatar address={address} user={item} size="xs" notSet={false} />
);

const PermissionManagementForm = ({
  colony: { watchers, domains },
  // colony,
  currentUserRoles,
  domainId,
  rootAccounts,
  userDirectRoles,
  userInheritedRoles,
  currentUserRolesInRoot,
  inputDisabled,
  userHasPermission,
  onDomainSelected,
  onMotionDomainChange,
  onChangeSelectedUser,
  values,
}: // isSubmitting,
Props & FormState<FormValues>) => {
  const colonyWatchers = useMemo(
    () =>
      watchers?.items
        .filter(notNull)
        .map((item) => ({ ...item.user, id: item.user.walletAddress })) || [],
    [watchers],
  );

  const colonyDomains = useMemo(() => domains?.items || [], [domains]);
  const domain = colonyDomains?.find(
    (colonyDomain) => colonyDomain?.nativeId === domainId,
  );

  const canSetPermissionsInRoot =
    domainId === Id.RootDomain &&
    currentUserRoles.includes(ColonyRole.Root) &&
    (!userDirectRoles.includes(ColonyRole.Root) || rootAccounts.length > 1);
  const hasRoot = currentUserRolesInRoot.includes(ColonyRole.Root);
  const hasArchitectureInRoot = currentUserRolesInRoot.includes(
    ColonyRole.Architecture,
  );
  // const canEditPermissions =
  //   (domainId === Id.RootDomain &&
  //     currentUserRolesInRoot.includes(ColonyRole.Root)) ||
  //   currentUserRolesInRoot.includes(ColonyRole.Architecture);
  const requiredRoles: ColonyRole[] = [ColonyRole.Architecture];

  // Check which roles the current user is allowed to set in this domain
  const canRoleBeSet = useCallback(
    (role: ColonyRole) => {
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
            (domainId === Id.RootDomain && hasRoot) || hasArchitectureInRoot
          );

        default:
          return false;
      }
    },
    [domainId, canSetPermissionsInRoot, hasArchitectureInRoot, hasRoot],
  );

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
      value: colonyDomain?.nativeId || '',
      label: colonyDomain?.name || '',
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

  const handleDomainChange = useCallback(
    (domainValue: string) => {
      const fromDomainId = parseInt(domainValue, 10);
      const selectedMotionDomainId = parseInt(values.motionDomainId, 10);
      onDomainSelected(fromDomainId);
      if (selectedMotionDomainId !== fromDomainId) {
        onMotionDomainChange(fromDomainId);
      }
    },
    [onDomainSelected, onMotionDomainChange, values.motionDomainId],
  );

  // const handleFilterMotionDomains = useCallback(
  //   (optionDomain) => {
  //     const optionDomainId = parseInt(optionDomain.value, 10);
  //     if (domainId === Id.RootDomain) {
  //       return optionDomainId === Id.RootDomain;
  //     }
  //     return optionDomainId === domainId || optionDomainId === Id.RootDomain;
  //   },
  //   [domainId],
  // );

  // const handleMotionDomainChange = useCallback(
  //   (motionDomainId) => onMotionDomainChange(motionDomainId),
  //   [onMotionDomainChange],
  // );

  const filteredRoles = useMemo(
    () =>
      domainId !== Id.RootDomain
        ? availableRoles.filter(
            (role) => role !== ColonyRole.Root && role !== ColonyRole.Recovery,
          )
        : availableRoles,
    [domainId],
  );

  // const {
  //   votingExtensionVersion,
  //   isVotingExtensionEnabled,
  // } = useEnabledExtensions({
  //   colonyAddress,
  // });

  // const cannotCreateMotion =
  //   votingExtensionVersion ===
  //     VotingReputationExtensionVersion.FuchsiaLightweightSpaceship &&
  //   !values.forceAction;

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.modalHeading}>
          {/*
           * @NOTE We can only create a motion to vote in a subdomain if we
           * create a payment from that subdomain
           */}
          {/* {isVotingExtensionEnabled && (
            <div className={styles.motionVoteDomain}>
              <MotionDomainSelect
                colony={colony}
                onDomainChange={handleMotionDomainChange}
                disabled={values.forceAction}
                filterDomains={handleFilterMotionDomains}
                initialSelectedDomain={parseInt(values.domainId, 10)}
              />
            </div>
          )} */}
          <div className={styles.headingContainer}>
            <Heading3
              appearance={{ margin: 'none', theme: 'dark' }}
              text={MSG.title}
              textValues={{ domain: domain?.name }}
            />
            {/* {canEditPermissions && isVotingExtensionEnabled && (
              <ForceToggle disabled={isSubmitting} />
            )} */}
          </div>
        </div>
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
            onSelected={onChangeSelectedUser}
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
              !userDirectRoles.includes(role) &&
              userInheritedRoles.includes(role);
            return (
              <PermissionManagementCheckbox
                key={role}
                disabled={
                  inputDisabled || !canRoleBeSet(role) || roleIsInherited
                }
                role={role}
                asterisk={roleIsInherited}
                domainId={domainId}
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
    </>
  );
};

export default PermissionManagementForm;
