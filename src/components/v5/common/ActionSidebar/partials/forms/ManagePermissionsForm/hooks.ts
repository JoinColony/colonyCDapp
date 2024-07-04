import { Id } from '@colony/colony-js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { type DeepPartial } from 'utility-types';
import { object, string, number } from 'yup';

import { UserRole, getRole } from '~constants/permissions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ActionTypes } from '~redux/index.ts';
import { getUserRolesForDomain } from '~transformers/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { mapPayload, pipe } from '~utils/actions.ts';
import { notMaybe } from '~utils/arrays/index.ts';
import { getObjectKeys } from '~utils/objects/index.ts';
import { getEnumYupSchema } from '~utils/yup/utils.ts';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts.ts';

import useActionFormBaseHook from '../../../hooks/useActionFormBaseHook.ts';
import { type ActionFormBaseProps } from '../../../types.ts';

import {
  Authority,
  AVAILABLE_ROLES,
  type ManagePermissionsFormValues,
  permissionsSchema,
  schemaTests,
  type SchemaTestContext,
} from './consts.ts';
import {
  extractColonyRoleFromPermissionKey,
  getManagePermissionsPayload,
} from './utils.ts';

const useManagePermissionsValidationSchema = () => {
  const [currentPermissions, setCurrentPermissions] = useState<Array<number>>(
    [],
  );
  const [currentRole, setCurrentRole] = useState<UserRole | undefined>(
    undefined,
  );

  const validationSchema = useMemo(
    () =>
      object()
        .shape<ManagePermissionsFormValues>({
          member: string().required(),
          team: number().required(),
          createdIn: number().required(),
          role: string()
            .test(
              schemaTests.role.scope,
              schemaTests.role.testTitles.samePermissionsApplied,
              (role, { parent: { member, team } }: SchemaTestContext) => {
                if (member && team && role && role !== UserRole.Custom) {
                  return role !== currentRole;
                }

                return true;
              },
            )
            .required(),
          authority: getEnumYupSchema(Authority).required(),
          permissions: permissionsSchema
            .test(
              schemaTests.permissions.scope,
              schemaTests.permissions.testTitles.permissionRequired,
              (
                permissions,
                { parent: { member, team, role } }: SchemaTestContext,
              ) => {
                if (member && team && permissions) {
                  if (role === UserRole.Custom) {
                    return Object.values(permissions).some(Boolean);
                  }
                }
                return true;
              },
            )
            .test(
              schemaTests.permissions.scope,
              schemaTests.permissions.testTitles.samePermissionsApplied,
              (
                permissions,
                { parent: { member, team, role } }: SchemaTestContext,
              ) => {
                if (member && team && role === UserRole.Custom && permissions) {
                  // At this point, the user's current and db-stored permissions are represented as ColonyRole[]: [0, 1, 5, 6]
                  // Meanwhile the form-formatted permissions are represented as an object: { role_0: false, ... role_6: true }
                  // We'd want to filter the truthy form-formatted permissions and map their ColonyRole suffixes
                  // i.e. { role_0: false, role_1: true, role_2: false, role_4: true } => [1, 4]
                  const newPermissions = getObjectKeys(permissions)
                    .filter((permissionKey) => permissions[permissionKey])
                    .map(extractColonyRoleFromPermissionKey);

                  if (
                    newPermissions.includes(null) ||
                    newPermissions.length === currentPermissions.length
                  ) {
                    return false;
                  }

                  return (
                    JSON.stringify(currentPermissions.sort()) !==
                    JSON.stringify(newPermissions.sort())
                  );
                }

                return true;
              },
            ),
          decisionMethod: getEnumYupSchema(DecisionMethod).required(),
          description: string().optional(),
        })
        .defined()
        .concat(ACTION_BASE_VALIDATION_SCHEMA),
    [currentPermissions, currentRole],
  );

  return { validationSchema, setCurrentPermissions, setCurrentRole };
};

export const useManagePermissions = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const formDecisionMethod = useWatch<
    ManagePermissionsFormValues,
    'decisionMethod'
  >({
    name: 'decisionMethod',
  });
  const {
    setValue,
    watch,
    trigger,
    clearErrors,
    formState: { submitCount },
  } = useFormContext<ManagePermissionsFormValues>();

  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const navigate = useNavigate();
  const formRole = useWatch<ManagePermissionsFormValues, 'role'>({
    name: 'role',
  });
  const isModeRoleSelected = formRole === UserRole.Mod;
  const { validationSchema, setCurrentPermissions, setCurrentRole } =
    useManagePermissionsValidationSchema();

  useEffect(() => {
    if (isModeRoleSelected) {
      setValue('authority', Authority.Own);
    }
  }, [isModeRoleSelected, setValue]);

  useEffect(() => {
    const { unsubscribe } = watch(({ member, team, role }, { name }) => {
      if (role === UserRole.Custom && submitCount > 0) {
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

      const currentPermissions = getUserRolesForDomain({
        colony,
        userAddress: member,
        domainId: Number(team),
      });
      const userRole = getRole(currentPermissions);

      const currentRole = userRole.permissions.length
        ? userRole.role
        : undefined;

      setCurrentRole(currentRole);
      setCurrentPermissions(currentPermissions);

      setValue('role', currentRole);

      clearErrors('role');

      AVAILABLE_ROLES.forEach((colonyRole) => {
        setValue(
          `permissions.role_${colonyRole}`,
          userRole.permissions.includes(colonyRole),
        );
      });
    });

    return () => unsubscribe();
  }, [
    clearErrors,
    colony,
    setCurrentPermissions,
    setCurrentRole,
    setValue,
    submitCount,
    trigger,
    watch,
  ]);

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
