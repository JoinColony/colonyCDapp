import { ColonyRole, Id } from '@colony/colony-js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { type DeepPartial } from 'utility-types';

import { UserRole } from '~constants/permissions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ActionTypes } from '~redux/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { mapPayload, pipe } from '~utils/actions.ts';
import { notMaybe } from '~utils/arrays/index.ts';
import useActionFormBaseHook from '~v5/common/ActionSidebar/hooks/useActionFormBaseHook.ts';
import { type ActionFormBaseProps } from '~v5/common/ActionSidebar/types.ts';

import {
  UserRoleModifier,
  type ManagePermissionsFormValues,
  validationSchema,
  MANAGE_PERMISSIONS_ACTION_FORM_ID,
} from './consts.ts';
import {
  configureFormRoles,
  getManagePermissionsPayload,
  getFormPermissions,
  getRemovedInheritedPermissions,
} from './utils.ts';

export const useManagePermissionsForm = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const navigate = useNavigate();

  const [showPermissionsRemovalWarning, setShowPermissionsRemovalWarning] =
    useState(false);

  const {
    watch,
    trigger,
    setValue,
    clearErrors,
    formState: { defaultValues, isSubmitted, errors, isValid, isSubmitting },
  } = useFormContext<ManagePermissionsFormValues>();

  const formValues = watch();

  const {
    team: formTeam,
    permissions: formPermissions,
    decisionMethod: formDecisionMethod,
    _dbInheritedPermissions: dbInheritedPermissions,
    role: formRole,
  } = formValues;

  useEffect(() => {
    /**
     * This effect handles the population of permissions-related form values when the
     * Manage Permissions form is given default values via the "Redo action" flow
     */
    const { member, role, team, authority } = defaultValues ?? {};

    if (member && role && team && authority) {
      configureFormRoles({
        colony,
        isSubmitted: false,
        member,
        role,
        setValue,
        team,
        authority,
        roleOverride: true,
      });
    }
  }, [colony, defaultValues, setValue]);

  useEffect(() => {
    const { unsubscribe } = watch(
      ({ member, team, authority, role }, { name }) => {
        if (isSubmitted) {
          if (role === UserRole.Custom) {
            trigger('permissions');
          } else {
            clearErrors('permissions');
          }
        }

        if (role === UserRoleModifier.Remove) {
          trigger('role');
        } else {
          clearErrors('role');
        }

        if (
          !name ||
          !['team', 'member', 'authority'].includes(name) ||
          !notMaybe(team) ||
          !notMaybe(member) ||
          !notMaybe(authority)
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
          authority,
        });
      },
    );

    return () => unsubscribe();
  }, [clearErrors, colony, isSubmitted, setValue, trigger, watch]);

  const isRemovingRootRoleFromRootDomain = useMemo(
    () =>
      isValid &&
      formTeam === Id.RootDomain &&
      getRemovedInheritedPermissions({
        dbInheritedPermissions,
        formPermissions: getFormPermissions({
          formPermissions,
          formRole,
        }),
      }).includes(ColonyRole.Root),
    [dbInheritedPermissions, formPermissions, formRole, formTeam, isValid],
  );

  useActionFormBaseHook({
    getFormOptions,
    validationSchema,
    actionType:
      formDecisionMethod === DecisionMethod.Reputation ||
      formDecisionMethod === DecisionMethod.MultiSig
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
    id: MANAGE_PERMISSIONS_ACTION_FORM_ID,
    primaryButton: {
      type: isRemovingRootRoleFromRootDomain ? 'button' : 'submit',
      onClick: useCallback(() => setShowPermissionsRemovalWarning(true), []),
    },
  });

  return {
    role: formRole,
    values: watch(),
    errors,
    formValues,
    isSubmitting,
    showPermissionsRemovalWarning,
    setShowPermissionsRemovalWarning,
  };
};
