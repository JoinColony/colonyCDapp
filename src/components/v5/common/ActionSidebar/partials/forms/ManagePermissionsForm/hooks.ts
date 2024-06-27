import { Id } from '@colony/colony-js';
import { useCallback, useEffect, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { type DeepPartial } from 'utility-types';
import { type InferType, mixed, number, object, string } from 'yup';

import { CUSTOM_USER_ROLE, UserRole, getRole } from '~constants/permissions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ActionTypes } from '~redux/index.ts';
import { getUserRolesForDomain } from '~transformers/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { mapPayload, pipe } from '~utils/actions.ts';
import { notMaybe } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';
import {
  ACTION_BASE_VALIDATION_SCHEMA,
  DECISION_METHOD_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';

import useActionFormBaseHook from '../../../hooks/useActionFormBaseHook.ts';
import { type ActionFormBaseProps } from '../../../types.ts';

import { Authority, AVAILABLE_ROLES, RemoveRoleOptionValue } from './consts.ts';
import { getManagePermissionsPayload } from './utils.ts';

export const useValidationSchema = () => {
  const { colony } = useColonyContext();

  return useMemo(
    () =>
      object()
        .shape({
          member: string().required(
            formatText({ id: 'errors.member.required' }),
          ),
          team: number().required(formatText({ id: 'errors.team.required' })),
          createdIn: number().required(),
          role: string()
            .required(formatText({ id: 'errors.role.required' }))
            .test(
              'has-role',
              formatText({ id: 'errors.role.noPermissionsToRemove' }),
              (value, context) => {
                if (!value) {
                  return true;
                }

                const { member, team, role } = context.parent;

                if (
                  !member ||
                  !team ||
                  !role ||
                  role !== RemoveRoleOptionValue.remove
                ) {
                  return true;
                }

                const userPermissions = getUserRolesForDomain({
                  colony,
                  userAddress: member,
                  domainId: team,
                  excludeInherited: true,
                });

                const userInheritedPermissions = getUserRolesForDomain({
                  colony,
                  userAddress: member,
                  domainId: team,
                });

                const hasPermissionsToRemove = !!userPermissions.length;

                if (
                  !hasPermissionsToRemove &&
                  !!userInheritedPermissions.length
                ) {
                  return context.createError({
                    message: formatText({
                      id: 'errors.role.cantRemoveInheritedPermissions',
                    }),
                  });
                }

                return hasPermissionsToRemove;
              },
            ),
          authority: string().required(
            formatText({ id: 'errors.authority.required' }),
          ),
          permissions: mixed<Partial<Record<string, boolean>>>().test(
            'permissions',
            formatText({ id: 'errors.authority.required' }),
            (value, { parent }) => {
              if (parent.role !== CUSTOM_USER_ROLE.role) {
                return true;
              }

              return Object.values(value || {}).some(Boolean);
            },
          ),
          decisionMethod: string().defined(),
        })
        .defined()
        .concat(ACTION_BASE_VALIDATION_SCHEMA),
    [colony],
  );
};
export type ManagePermissionsFormValues = InferType<
  ReturnType<typeof useValidationSchema>
>;

export const useManagePermissions = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const decisionMethod: DecisionMethod | undefined = useWatch({
    name: DECISION_METHOD_FIELD_NAME,
  });
  const { setValue, watch, trigger } =
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
    const { unsubscribe } = watch(
      ({ member, team, role: fieldRole }, { name, type }) => {
        if (
          !name ||
          !['team', 'member'].includes(name) ||
          team === undefined ||
          !notMaybe(member)
        ) {
          return;
        }

        const userPermissions = getUserRolesForDomain({
          colony,
          userAddress: member,
          domainId: team,
          excludeInherited: true,
        });
        const userRole = getRole(userPermissions);
        const newRoleValue = userRole.permissions.length
          ? userRole.role
          : undefined;

        setValue(
          'role',
          newRoleValue === UserRole.Owner && team !== Id.RootDomain
            ? undefined
            : newRoleValue,
        );

        if (
          (fieldRole && newRoleValue && fieldRole !== newRoleValue) ||
          (type === 'change' && name === 'team' && !!userPermissions.length)
        ) {
          trigger('role');
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
      },
    );

    return () => unsubscribe();
  }, [colony, role, setValue, watch, trigger]);

  const validationSchema = useValidationSchema();

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
    isModRoleSelected,
  };
};
