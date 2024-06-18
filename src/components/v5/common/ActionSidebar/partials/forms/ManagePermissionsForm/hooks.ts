import { Id } from '@colony/colony-js';
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
                { parent }: { parent: ManagePermissionsFormValues },
              ) => {
                const { member, team } = parent;

                if (member && team && role && role !== UserRole.Custom) {
                  return role !== currentRole;
                }

                if (member && team) {
                  clearErrors('role');
                }

                return true;
              },
            )
            .required(),
          authority: string().required(),
          permissions: mixed<Partial<Record<string, boolean>>>()
            .test(
              'permissions',
              'You have to select at least one permission.',
              (
                permissions: Record<string, boolean>,
                { parent }: { parent: ManagePermissionsFormValues },
              ) => {
                if (parent.role !== CUSTOM_USER_ROLE.role) {
                  return true;
                }

                return Object.values(permissions).some(Boolean);
              },
            )
            .test(
              'permissions',
              formatMessage(
                MANAGE_PERMISSIONS_FORM_MSGS.samePermissionsApplied,
              ),
              (
                permissions: Record<string, boolean>,
                { parent }: { parent: ManagePermissionsFormValues },
              ) => {
                if (parent.role === UserRole.Custom) {
                  const newPermissions = Object.keys(permissions)
                    .filter((key) => !!permissions[key])
                    .map((key) => Number(key.slice(-1)));

                  if (newPermissions.length === currentPermissions.length) {
                    return false;
                  }

                  const areTheSame =
                    JSON.stringify(currentPermissions.sort()) ===
                    JSON.stringify(Object.values(newPermissions).sort());

                  return !areTheSame;
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
  const isModeRoleSelected = role === UserRole.Mod;
  const { validationSchema, setCurrentPermissions, setCurrentRole } =
    useManagePermissionsValidationSchema();

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

      const userPermissions = getUserRolesForDomain({
        colony,
        userAddress: member,
        domainId: Number(team),
      });
      const userRole = getRole(userPermissions);

      const finalRole = userRole.permissions.length ? userRole.role : undefined;

      setCurrentRole(finalRole);
      setCurrentPermissions(userPermissions);

      setValue('role', finalRole);

      AVAILABLE_ROLES.forEach((colonyRole) => {
        setValue(
          `permissions.role_${colonyRole}`,
          userRole.permissions.includes(colonyRole),
        );
      });
    });

    return () => unsubscribe();
  }, [colony, setCurrentPermissions, setCurrentRole, setValue, watch]);

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
