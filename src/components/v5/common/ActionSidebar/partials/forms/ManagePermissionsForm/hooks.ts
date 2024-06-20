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
  type RemoveRoleOptionValue,
  validationSchema,
  FIELD_NAME,
} from './consts.ts';
import { getManagePermissionsPayload } from './utils.ts';

export const useManagePermissions = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const decisionMethod: DecisionMethod | undefined = useWatch({
    name: FIELD_NAME.DECISION_METHOD,
  });
  const {
    setValue,
    watch,
    formState: { isValid, isSubmitted },
  } = useFormContext<Partial<ManagePermissionsFormValues>>();
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const navigate = useNavigate();
  const role: UserRole | RemoveRoleOptionValue | undefined = useWatch({
    name: FIELD_NAME.ROLE,
  });
  const isModeRoleSelected = role === UserRole.Mod;

  useEffect(() => {
    if (isModeRoleSelected) {
      setValue(FIELD_NAME.AUTHORITY, Authority.Own);
    }
  }, [isModeRoleSelected, setValue]);

  useEffect(() => {
    const { unsubscribe } = watch(({ member, team }, { name }) => {
      if (
        !name ||
        !([FIELD_NAME.MEMBER, FIELD_NAME.TEAM] as string[]).includes(name) ||
        !notMaybe(team) ||
        !notMaybe(member)
      ) {
        return;
      }

      const userPermissions = getUserRolesForDomain({
        colony,
        userAddress: member,
        domainId: Number(team),
      });
      const userRole = getRole(userPermissions);
      const roleValue = userRole.permissions.length ? userRole.role : undefined;

      setValue(FIELD_NAME.ROLE, roleValue, {
        shouldValidate: !!roleValue || (isSubmitted && !isValid),
      });

      if (userRole.role !== UserRole.Custom) {
        return;
      }

      AVAILABLE_ROLES.forEach((colonyRole) => {
        setValue(
          `${FIELD_NAME.PERMISSIONS}.role_${colonyRole}`,
          userRole.permissions.includes(colonyRole),
        );
      });
    });

    return () => unsubscribe();
  }, [colony, role, setValue, watch, isSubmitted, isValid]);

  useActionFormBaseHook({
    getFormOptions,
    validationSchema,
    actionType:
      decisionMethod === DecisionMethod.Permissions
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
    role,
    isModeRoleSelected,
  };
};
