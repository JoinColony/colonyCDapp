import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo } from 'react';
import { DeepPartial } from 'utility-types';
import { useFormContext, useWatch } from 'react-hook-form';

import { ActionTypes } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import { useAppContext, useColonyContext } from '~hooks';
import { UserRole, USER_ROLE, getRole } from '~constants/permissions';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts';
import { notMaybe } from '~utils/arrays';
import { getUserRolesForDomain } from '~transformers';

import { ActionFormBaseProps } from '../../../types';
import { DecisionMethod, useActionFormBaseHook } from '../../../hooks';
import {
  AUTHORITY,
  AVAILABLE_ROLES,
  ManagePermissionsFormValues,
  REMOVE_ROLE_OPTION_VALUE,
  validationSchema,
} from './consts';
import { getManagePermissionsPayload } from './utils';

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
  const role: UserRole | typeof REMOVE_ROLE_OPTION_VALUE | undefined = useWatch(
    {
      name: 'role',
    },
  );
  const isModeRoleSelected = role === USER_ROLE.Mod;

  useEffect(() => {
    if (isModeRoleSelected) {
      setValue('authority', AUTHORITY.Own);
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

      if (userRole.role !== USER_ROLE.Custom) {
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
          if (!colony) {
            return null;
          }

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
