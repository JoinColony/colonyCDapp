import { ColonyRole, Id } from '@colony/colony-js';
import { useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { boolean, object } from 'yup';

import { type Action, ACTION } from '~constants/actions.ts';
import { useAppContext } from '~context/AppContext.tsx';
import { useColonyContext } from '~context/ColonyContext.tsx';
import { addressHasRoles } from '~utils/checks/index.ts';

import { DecisionMethod } from './useDecisionMethods.ts';

const getPermissionsNeededForAction = (
  actionType: Action,
  formValues: Record<string, any>,
): ColonyRole[] | undefined => {
  switch (actionType) {
    case ACTION.SIMPLE_PAYMENT:
      return [ColonyRole.Funding, ColonyRole.Administration];
    case ACTION.MINT_TOKENS:
      return [ColonyRole.Root];
    case ACTION.TRANSFER_FUNDS:
      return [ColonyRole.Funding];
    case ACTION.UNLOCK_TOKEN:
      return [ColonyRole.Root];
    case ACTION.MANAGE_TOKENS:
      return [ColonyRole.Root];
    case ACTION.CREATE_NEW_TEAM:
      return [ColonyRole.Architecture];
    case ACTION.EDIT_EXISTING_TEAM:
      return [ColonyRole.Architecture];
    case ACTION.MANAGE_REPUTATION:
      /**
       * @TODO: Once this action is wired, we'll need to tell if
       * it's a smite or award action (most likely from `formValues`)
       * If smite: Arbitration, else: Root
       */
      return undefined;
    case ACTION.MANAGE_PERMISSIONS: {
      const domainId = Number(formValues.team);
      if (!domainId) {
        return undefined;
      }
      return domainId === Id.RootDomain
        ? [ColonyRole.Root, ColonyRole.Architecture]
        : [ColonyRole.Architecture];
    }
    case ACTION.EDIT_COLONY_DETAILS:
    case ACTION.MANAGE_COLONY_OBJECTIVES:
      return [ColonyRole.Root];
    case ACTION.UPGRADE_COLONY_VERSION:
      return [ColonyRole.Root];
    case ACTION.ENTER_RECOVERY_MODE:
      return [ColonyRole.Recovery];
    default:
      return undefined;
  }
};

// Function returning the domain ID in which the user needs to have required permissions to create the action
const getRelevantPermissionsDomainId = (
  actionType: Action,
  formValues: Record<string, any>,
) => {
  switch (actionType) {
    case ACTION.SIMPLE_PAYMENT:
    case ACTION.TRANSFER_FUNDS:
      return formValues.from ? Number(formValues.from) : Id.RootDomain;
    case ACTION.MANAGE_REPUTATION:
    case ACTION.MANAGE_PERMISSIONS:
      return formValues.team ? Number(formValues.team) : Id.RootDomain;
    default:
      return Id.RootDomain;
  }
};

export const PERMISSIONS_VALIDATION_FIELD_NAME = 'isMissingPermissions';

export const permissionsValidationSchema = object()
  .shape({
    [PERMISSIONS_VALIDATION_FIELD_NAME]: boolean().oneOf(
      [false],
      // @NOTE: This message will not be shown in the UI
      'Missing permissions',
    ),
  })
  .defined();

export const usePermissionsValidation = () => {
  const { colony } = useColonyContext();
  const { wallet } = useAppContext();
  const {
    watch,
    setValue,
    formState: {
      errors: { [PERMISSIONS_VALIDATION_FIELD_NAME]: fieldError },
      isSubmitted,
    },
  } = useFormContext();

  const formValues = watch();
  const {
    actionType,
    decisionMethod,
    [PERMISSIONS_VALIDATION_FIELD_NAME]: fieldValue,
  } = formValues;

  const getIsMissingPermissions = useCallback(() => {
    if (decisionMethod === DecisionMethod.Reputation) {
      return false;
    }

    const relevantPermissionsDomainId = getRelevantPermissionsDomainId(
      actionType,
      formValues,
    );
    const requiredRoles = getPermissionsNeededForAction(actionType, formValues);
    if (!requiredRoles) {
      return true;
    }

    return !addressHasRoles({
      requiredRoles,
      requiredRolesDomains: [relevantPermissionsDomainId],
      colony,
      address: wallet?.address ?? '',
    });
  }, [actionType, colony, decisionMethod, formValues, wallet?.address]);

  const isMissingPermissions = getIsMissingPermissions();

  useEffect(() => {
    if (fieldValue !== isMissingPermissions) {
      setValue(PERMISSIONS_VALIDATION_FIELD_NAME, isMissingPermissions, {
        shouldValidate: true,
      });
    }
  }, [fieldValue, isMissingPermissions, setValue]);

  return { noPermissionsError: !!fieldError && isSubmitted };
};
