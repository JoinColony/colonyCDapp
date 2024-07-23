import { ColonyRole, Id } from '@colony/colony-js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { type DeepPartial } from 'utility-types';

import { getRole, UserRole } from '~constants/permissions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ActionTypes } from '~redux/index.ts';
import { getUserRolesForDomain } from '~transformers';
import { DecisionMethod } from '~types/actions.ts';
import { Authority } from '~types/authority.ts';
import { mapPayload, pipe } from '~utils/actions.ts';
import { notMaybe } from '~utils/arrays/index.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';
import useActionFormBaseHook from '~v5/common/ActionSidebar/hooks/useActionFormBaseHook.ts';
import { type ActionFormBaseProps } from '~v5/common/ActionSidebar/types.ts';

import {
  UserRoleModifier,
  type ManagePermissionsFormValues,
  validationSchema,
  MANAGE_PERMISSIONS_ACTION_FORM_ID,
} from './consts.ts';
import {
  configureFormRoles,
  getManagePermissionsPayload,
  getFormPermissions,
  getRemovedInheritedPermissions,
} from './utils.ts';

export const useManagePermissionsForm = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const navigate = useNavigate();

  const [showPermissionsRemovalWarning, setShowPermissionsRemovalWarning] =
    useState(false);

  const {
    watch,
    trigger,
    control,
    setValue,
    clearErrors,
    formState: { defaultValues, isSubmitted, errors, isValid, isSubmitting },
  } = useFormContext<ManagePermissionsFormValues>();

  const formDecisionMethod = useWatch({
    control,
    name: 'decisionMethod',
  });

  const formRole = useWatch({
    control,
    name: 'role',
  });
  const isModRoleSelected = formRole === UserRole.Mod;

  useEffect(() => {
    /**
     * This effect handles the population of permissions-related form values when the
     * Manage Permissions form is given default values via the "Redo action" flow
     */
    const { member, role, team, authority } = defaultValues ?? {};

    if (member && role && team && authority) {
      configureFormRoles({
        colony,
        isSubmitted: false,
        member,
        role,
        setValue,
        team,
        authority,
      });
    }
  }, [colony, defaultValues, setValue]);

  useEffect(() => {
    if (isModRoleSelected) {
      setValue('authority', Authority.Own);
    }
  }, [isModRoleSelected, setValue]);

  useEffect(() => {
    const { unsubscribe } = watch(
      ({ member, team, authority, role }, { name }) => {
        if (isSubmitted) {
          if (role === UserRoleModifier.Remove) {
            trigger('role');
          }

          if (role === UserRole.Custom) {
            trigger('permissions');
          } else {
            clearErrors('permissions');
          }

          if (
            !name ||
            !['team', 'member', 'authority'].includes(name) ||
            !notMaybe(team) ||
            !notMaybe(member) ||
            !notMaybe(authority)
          ) {
            return;
          }

          const isMultiSig = authority === Authority.ViaMultiSig;

          const userPermissions = getUserRolesForDomain({
            colonyRoles: extractColonyRoles(colony.roles),
            userAddress: member,
            domainId: Number(team),
            excludeInherited: true,
            isMultiSig,
          });

          const userRole = getRole(userPermissions);

          setValue(
            'role',
            userRole.permissions.length ? userRole.role : undefined,
          );

          if (userRole.role !== UserRole.Custom) {
            return;
          }

          configureFormRoles({
            colony,
            isSubmitted,
            member,
            role,
            setValue,
            team,
            authority,
          });
        }
      },
    );

    return () => unsubscribe();
  }, [clearErrors, colony, setValue, isSubmitted, trigger, watch]);

  const { team, permissions, _dbInheritedPermissions, role } = watch();

  const isRemovingRootRoleFromRootDomain =
    isValid &&
    team === Id.RootDomain &&
    getRemovedInheritedPermissions({
      dbInheritedPermissions: _dbInheritedPermissions,
      formPermissions: getFormPermissions({
        formPermissions: permissions,
        formRole: role,
      }),
    }).includes(ColonyRole.Root);

  useActionFormBaseHook({
    getFormOptions,
    validationSchema,
    actionType:
      formDecisionMethod === DecisionMethod.Reputation ||
      formDecisionMethod === DecisionMethod.MultiSig
        ? ActionTypes.MOTION_USER_ROLES_SET
        : ActionTypes.ACTION_USER_ROLES_SET,
    defaultValues: useMemo<DeepPartial<ManagePermissionsFormValues>>(
      () => ({
        createdIn: Id.RootDomain,
      }),
      [],
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((values: ManagePermissionsFormValues) => {
          return getManagePermissionsPayload(colony, values);
        }),
      ),
      [colony, user, navigate],
    ),
    id: MANAGE_PERMISSIONS_ACTION_FORM_ID,
    primaryButton: {
      type: isRemovingRootRoleFromRootDomain ? 'button' : 'submit',
      onClick: useCallback(() => setShowPermissionsRemovalWarning(true), []),
    },
  });

  return {
    role: formRole,
    isModRoleSelected,
    values: watch(),
    errors,
    isSubmitting,
    showPermissionsRemovalWarning,
    setShowPermissionsRemovalWarning,
  };
};
