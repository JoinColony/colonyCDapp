import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo } from 'react';
import { DeepPartial } from 'utility-types';
import { useFormContext, useWatch } from 'react-hook-form';
import { ActionTypes } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import { useAppContext, useColonyContext } from '~hooks';
import { ActionFormBaseProps } from '../../../types';
import { DecisionMethod, useActionFormBaseHook } from '../../../hooks';
import {
  AUTHORITY,
  ManagePermissionsFormValues,
  REMOVE_ROLE_OPTION_VALUE,
  validationSchema,
} from './consts';
import { UserRole, USER_ROLE } from '~constants/permissions';
import { getPermissionsMap } from './utils';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts';

export const useManagePermissions = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const decisionMethod: DecisionMethod | undefined = useWatch({
    name: DECISION_METHOD_FIELD_NAME,
  });
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
