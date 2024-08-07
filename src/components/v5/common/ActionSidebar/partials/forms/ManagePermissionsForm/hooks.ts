import { Id } from '@colony/colony-js';
import { useCallback, useEffect, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { type DeepPartial } from 'utility-types';

import { UserRole } from '~constants/permissions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ActionTypes } from '~redux/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { mapPayload, pipe } from '~utils/actions.ts';
import { notMaybe } from '~utils/arrays/index.ts';

import useActionFormBaseHook from '../../../hooks/useActionFormBaseHook.ts';
import { type ActionFormBaseProps } from '../../../types.ts';

import {
  type ManagePermissionsFormValues,
  validationSchema,
} from './consts.ts';
import { configureFormRoles, getManagePermissionsPayload } from './utils.ts';

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
    setError,
    clearErrors,
    formState: { errors, defaultValues, isSubmitted },
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
    /**
     * This effect handles the population of permissions-related form values when the
     * Manage Permissions form is given default values via the "Redo action" flow
     */
    const { member, role, team } = defaultValues ?? {};

    if (member && role && team) {
      configureFormRoles({
        colony,
        isSubmitted: false,
        member,
        role,
        setValue,
        team,
      });
    }
  }, [colony, defaultValues, setValue]);

  useEffect(() => {
    const { unsubscribe } = watch(({ member, team, role }, { name }) => {
      if (isSubmitted) {
        if (role === UserRole.Custom) {
          trigger('permissions');
        } else {
          clearErrors('permissions');
        }
      }

      if (
        !name ||
        !['team', 'member'].includes(name) ||
        !notMaybe(team) ||
        !notMaybe(member)
      ) {
        return;
      }

      configureFormRoles({
        colony,
        isSubmitted,
        member,
        role,
        setValue,
        team,
      });
    });

    return () => unsubscribe();
  }, [
    clearErrors,
    colony,
    errors.permissions,
    setError,
    setValue,
    isSubmitted,
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
    mode: 'onSubmit',
  });

  return {
    role: formRole,
    isModeRoleSelected,
  };
};
