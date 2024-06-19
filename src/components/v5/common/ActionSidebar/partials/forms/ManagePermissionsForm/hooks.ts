import { ColonyRole, Id } from '@colony/colony-js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { type DeepPartial } from 'utility-types';
import { mixed, object, string, number } from 'yup';

import { CUSTOM_USER_ROLE, UserRole, getRole } from '~constants/permissions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ActionTypes } from '~redux/index.ts';
import { getUserRolesForDomain } from '~transformers/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { mapPayload, pipe } from '~utils/actions.ts';
import { notMaybe } from '~utils/arrays/index.ts';
import { formatMessage } from '~utils/yup/tests/helpers.ts';
import {
  ACTION_BASE_VALIDATION_SCHEMA,
  DECISION_METHOD_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';

import useActionFormBaseHook from '../../../hooks/useActionFormBaseHook.ts';
import { type ActionFormBaseProps } from '../../../types.ts';

import {
  Authority,
  AVAILABLE_ROLES,
  MANAGE_PERMISSIONS_FORM_MSGS,
  type ManagePermissionsFormValues,
  type RemoveRoleOptionValue,
  type TestNodeContext,
} from './consts.ts';
import { getManagePermissionsPayload } from './utils.ts';

const useManagePermissionsValidationSchema = () => {
  const [currentPermissions, setCurrentPermissions] = useState<Array<number>>(
    [],
  );
  const [currentRole, setCurrentRole] = useState<UserRole | undefined>(
    undefined,
  );

  const { clearErrors } = useFormContext<ManagePermissionsFormValues>();

  const validationSchema = useMemo(
    () =>
      object()
        .shape({
          member: string().required(),
          team: number().required(),
          createdIn: number().required(),
          role: string()
            .test(
              'role',
              formatMessage(
                MANAGE_PERMISSIONS_FORM_MSGS.samePermissionsApplied,
              ),
              (
                role: UserRole,
                { parent: { member, team } }: TestNodeContext,
              ) => {
                if (member && team && role && role !== UserRole.Custom) {
                  return role !== currentRole;
                }

                clearErrors('role');

                return true;
              },
            )
            .required(),
          authority: string().required(),
          permissions: mixed<Partial<Record<string, boolean>>>()
            .test(
              'permissions',
              formatMessage(MANAGE_PERMISSIONS_FORM_MSGS.permissionRequired),
              (
                permissions: Record<string, boolean>,
                { parent: { member, team, role } }: TestNodeContext,
              ) => {
                if (member && team)
                  if (role === CUSTOM_USER_ROLE.role) {
                    return Object.values(permissions).some(Boolean);
                  }

                return true;
              },
            )
            .test(
              'permissions',
              formatMessage(
                MANAGE_PERMISSIONS_FORM_MSGS.samePermissionsApplied,
              ),
              (
                permissions: Record<string, boolean>,
                { parent: { member, team, role } }: TestNodeContext,
              ) => {
                if (member && team && role === UserRole.Custom) {
                  // At this point, the user's current and db-stored permissions are represented as ColonyRole[]: [0, 1, 5, 6]
                  // Meanwhile the form-formatted permissions are represented as an object: { role_0: false, ... role_6: true }
                  // We'd want to filter the truthy form-formatted permissions and map their ColonyRole suffixes
                  // i.e. { role_0: false, role_1: true, role_2: false, role_4: true } => [1, 4]
                  const newPermissions = Object.keys(permissions)
                    .filter((permissionKey) => permissions[permissionKey])
                    .map((permissionKey) => {
                      const colonyRole = permissionKey.match(/role_(\d+)/)?.[1];

                      if (colonyRole && colonyRole in ColonyRole) {
                        return Number(colonyRole);
                      }

                      console.error(
                        'Manage Permissions Form: Invalid permission: ',
                        permissionKey,
                      );

                      return null;
                    });

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
          decisionMethod: string().defined(),
        })
        .defined()
        .concat(ACTION_BASE_VALIDATION_SCHEMA),
    [clearErrors, currentPermissions, currentRole],
  );

  return { validationSchema, setCurrentPermissions, setCurrentRole };
};

export const useManagePermissions = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const formDecisionMethod: DecisionMethod | undefined = useWatch({
    name: DECISION_METHOD_FIELD_NAME,
  });
  const {
    setValue,
    watch,
    trigger,
    clearErrors,
    formState: { submitCount },
  } = useFormContext<Partial<ManagePermissionsFormValues>>();
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const navigate = useNavigate();
  const formRole: UserRole | RemoveRoleOptionValue | undefined = useWatch({
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
