import { Id } from '@colony/colony-js';
import { useCallback, useEffect, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { type DeepPartial } from 'utility-types';

import { UserRole, getRole } from '~constants/permissions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ActionTypes } from '~redux/index.ts';
import { getUserRolesForDomain } from '~transformers/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { mapPayload, pipe } from '~utils/actions.ts';
import { notMaybe } from '~utils/arrays/index.ts';

import useActionFormBaseHook from '../../../hooks/useActionFormBaseHook.ts';
import { type ActionFormBaseProps } from '../../../types.ts';

import {
  Authority,
  AVAILABLE_ROLES,
  type ManagePermissionsFormValues,
  validationSchema,
} from './consts.ts';
import { getManagePermissionsPayload } from './utils.ts';

export const useManagePermissions = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const navigate = useNavigate();

  const {
    watch,
    trigger,
    control,
    setValue,
    clearErrors,
    formState: { submitCount },
  } = useFormContext<ManagePermissionsFormValues>();

  const formDecisionMethod = useWatch({
    control,
    name: 'decisionMethod',
  });

  const formRole = useWatch({
    control,
    name: 'role',
  });

  const isModeRoleSelected = formRole === UserRole.Mod;

  useEffect(() => {
    if (isModeRoleSelected) {
      setValue('authority', Authority.Own);
    }
  }, [isModeRoleSelected, setValue]);

  useEffect(() => {
    const { unsubscribe } = watch(({ member, team, role }, { name }) => {
      if (role === UserRole.Custom) {
        trigger('permissions');
      } else {
        clearErrors('permissions');
      }

      if (
        !name ||
        !['team', 'member'].includes(name) ||
        !notMaybe(team) ||
        !notMaybe(member)
      ) {
        return;
      }

      const userRolesForDomain = getUserRolesForDomain({
        colony,
        userAddress: member,
        domainId: team,
        excludeInherited: true,
      });

      const userRoleMeta = getRole(userRolesForDomain);

      const userRole = userRoleMeta.permissions.length
        ? userRoleMeta.role
        : undefined;

      setValue('dbUserRole', userRole);
      setValue('dbUserPermissions', userRolesForDomain);

      if (role !== UserRole.Custom) {
        setValue('role', userRole, { shouldValidate: true });
      }

      AVAILABLE_ROLES.forEach((colonyRole) => {
        setValue(
          `permissions.role_${colonyRole}`,
          userRoleMeta.permissions.includes(colonyRole),
        );
      });
    });

    return () => unsubscribe();
  }, [clearErrors, colony, setValue, submitCount, trigger, watch]);

  useActionFormBaseHook({
    getFormOptions,
    validationSchema,
    actionType:
      formDecisionMethod === DecisionMethod.Permissions
        ? ActionTypes.ACTION_USER_ROLES_SET
        : ActionTypes.MOTION_USER_ROLES_SET,
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
  });

  return {
    role: formRole,
    isModeRoleSelected,
  };
};
