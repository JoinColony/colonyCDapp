import { useCallback, useEffect, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { type DeepPartial } from 'utility-types';

import { UserRole, getRole } from '~constants/permissions.ts';
import { useAppContext } from '~context/AppContext.tsx';
import { useColonyContext } from '~context/ColonyContext.tsx';
import { ActionTypes } from '~redux/index.ts';
import { getUserRolesForDomain } from '~transformers/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { mapPayload, pipe } from '~utils/actions.ts';
import { notMaybe } from '~utils/arrays/index.ts';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts.tsx';

import { useActionFormBaseHook } from '../../../hooks/index.ts';
import { type ActionFormBaseProps } from '../../../types.ts';

import {
  Authority,
  AVAILABLE_ROLES,
  type ManagePermissionsFormValues,
  type RemoveRoleOptionValue,
  validationSchema,
} from './consts.tsx';
import { getManagePermissionsPayload } from './utils.tsx';

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
  const role: UserRole | typeof RemoveRoleOptionValue | undefined = useWatch({
    name: 'role',
  });
  const isModeRoleSelected = role === UserRole.Mod;

  useEffect(() => {
    if (isModeRoleSelected) {
      setValue('authority', Authority.Own);
    }
  }, [isModeRoleSelected, setValue]);

  useEffect(() => {
    const { unsubscribe } = watch(({ member, team }, { name }) => {
      if (
        !name ||
        !['team', 'member'].includes(name) ||
        !notMaybe(team) ||
        !notMaybe(member)
      ) {
        return;
      }

      const userPermissions = getUserRolesForDomain(
        colony,
        member,
        Number(team),
      );
      const userRole = getRole(userPermissions);

      setValue('role', userRole.permissions.length ? userRole.role : undefined);

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
      decisionMethod === DecisionMethod.Permissions
        ? ActionTypes.ACTION_USER_ROLES_SET
        : ActionTypes.MOTION_USER_ROLES_SET,
    defaultValues: useMemo<DeepPartial<ManagePermissionsFormValues>>(
      () => ({}),
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
    isModeRoleSelected,
  };
};
