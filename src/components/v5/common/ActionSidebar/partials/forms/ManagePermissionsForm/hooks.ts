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
import { Authority } from '~types/authority.ts';
import { mapPayload, pipe } from '~utils/actions.ts';
import { notMaybe } from '~utils/arrays/index.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';

import useActionFormBaseHook from '../../../hooks/useActionFormBaseHook.ts';
import { type ActionFormBaseProps } from '../../../types.ts';

import {
  AVAILABLE_ROLES,
  type ManagePermissionsFormValues,
  type RemoveRoleOptionValue,
  validationSchema,
} from './consts.ts';
import { getManagePermissionsPayload } from './utils.ts';

export const useManagePermissions = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const decisionMethod: DecisionMethod | undefined = useWatch({
    name: DECISION_METHOD_FIELD_NAME,
  });
  const { setValue, watch } =
    useFormContext<Partial<ManagePermissionsFormValues>>();
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const navigate = useNavigate();
  const role: UserRole | RemoveRoleOptionValue | undefined = useWatch({
    name: 'role',
  });
  const isModRoleSelected = role === UserRole.Mod;

  useEffect(() => {
    if (isModRoleSelected) {
      setValue('authority', Authority.Own);
    }
  }, [isModRoleSelected, setValue]);

  useEffect(() => {
    const { unsubscribe } = watch(({ member, team, authority }, { name }) => {
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

      if (userRole.permissions.length) {
        setValue('role', userRole.role);
      }

      if (userRole.role !== UserRole.Custom) {
        return;
      }

      AVAILABLE_ROLES.forEach((colonyRole) => {
        setValue(
          `permissions.role_${colonyRole}`,
          userRole.permissions.includes(colonyRole),
        );
      });
    });

    return () => unsubscribe();
  }, [colony, role, setValue, watch]);

  useActionFormBaseHook({
    getFormOptions,
    validationSchema,
    actionType:
      decisionMethod === DecisionMethod.Reputation ||
      decisionMethod === DecisionMethod.MultiSig
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
  });

  return {
    role,
    isModRoleSelected,
  };
};
