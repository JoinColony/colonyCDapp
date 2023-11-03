import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo } from 'react';
import { DeepPartial } from 'utility-types';
import { useFormContext, useWatch } from 'react-hook-form';
import { Id } from '@colony/colony-js';
import { ActionTypes } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import { useAppContext, useColonyContext } from '~hooks';
import { ActionFormBaseProps } from '../../../types';
import { useActionFormBaseHook } from '../../../hooks';
import {
  AUTHORITY,
  ManagePermissionsFormValues,
  REMOVE_ROLE_OPTION_VALUE,
  validationSchema,
} from './consts';
import { UserRole, USER_ROLE } from '~constants/permissions';
import { getPermissionsMap } from './utils';
import { DECISION_METHOD_OPTIONS } from '../../consts';

export const useManagePermissions = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { setValue } = useFormContext<ManagePermissionsFormValues>();
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

  useActionFormBaseHook({
    getFormOptions,
    validationSchema,
    actionType: ActionTypes.ACTION_USER_ROLES_SET,
    defaultValues: useMemo<DeepPartial<ManagePermissionsFormValues>>(
      () => ({
        description: '',
        createdIn: Id.RootDomain.toString(),
        decisionMethod: DECISION_METHOD_OPTIONS[0]?.value,
      }),
      [],
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((payload: ManagePermissionsFormValues) => {
          if (!colony) {
            return null;
          }

          return {
            annotationMessage: payload.description,
            domainId: Number(payload.team),
            userAddress: payload.member,
            colonyName: colony.name,
            colonyAddress: colony.colonyAddress,
            roles: getPermissionsMap(payload.permissions, payload.role),
          };
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
