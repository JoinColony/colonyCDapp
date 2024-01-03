import { Id } from '@colony/colony-js';
import moveDecimal from 'move-decimal-point';
import { useMemo } from 'react';

import { ACTION } from '~constants/actions';
import { getRole, USER_ROLE } from '~constants/permissions';
import { ColonyActionType } from '~gql';
import { convertRolesToArray } from '~transformers';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import { ACTION_TYPE_FIELD_NAME } from '../consts';
import {
  AUTHORITY,
  AVAILABLE_ROLES,
} from '../partials/forms/ManagePermissionsForm/consts';

import { DecisionMethod } from './useDecisionMethods';
import { useGetColonyAction } from './useGetColonyAction';

export const useGetActionData = (transactionId: string | undefined) => {
  const { action, loadingAction } = useGetColonyAction(transactionId);

  const defaultValues = useMemo(() => {
    if (!action) {
      return undefined;
    }

    const {
      type,
      amount,
      token,
      payments,
      pendingColonyMetadata,
      pendingDomainMetadata,
      fromDomain,
      toDomain,
      motionData,
      decisionData,
      recipientAddress,
      annotation,
      isMotion,
      roles,
    } = action;

    const repeatableFields = {
      createdIn: isMotion
        ? motionData?.motionDomain.nativeId.toString()
        : Id.RootDomain.toString(),
      description: annotation?.message,
      title: action.metadata?.customTitle,
      decisionMethod: action.isMotion
        ? DecisionMethod.Reputation
        : DecisionMethod.Permissions,
    };

    switch (type) {
      case ColonyActionType.MintTokens:
      case ColonyActionType.MintTokensMotion:
        return {
          [ACTION_TYPE_FIELD_NAME]: ACTION.MINT_TOKENS,
          amount: {
            amount,
            tokenAddress: token?.tokenAddress,
          },
          ...repeatableFields,
        };
      case ColonyActionType.Payment:
      case ColonyActionType.PaymentMotion: {
        return {
          [ACTION_TYPE_FIELD_NAME]: ACTION.SIMPLE_PAYMENT,
          amount: {
            amount: moveDecimal(
              amount,
              -getTokenDecimalsWithFallback(token?.decimals),
            ),
            tokenAddress: token?.tokenAddress,
          },
          from: fromDomain?.nativeId.toString(),
          recipient: recipientAddress,
          ...repeatableFields,
        };
      }
      case ColonyActionType.MultiplePayment:
      case ColonyActionType.MultiplePaymentMotion: {
        const [firstPayment, ...additionalPayments] = payments || [];

        return {
          [ACTION_TYPE_FIELD_NAME]: ACTION.SIMPLE_PAYMENT,
          from: fromDomain?.nativeId.toString(),
          amount: {
            amount: moveDecimal(
              firstPayment.amount,
              -getTokenDecimalsWithFallback(token?.decimals),
            ),
            tokenAddress: firstPayment.tokenAddress,
          },
          recipient: firstPayment.recipientAddress,
          payments: additionalPayments.map((additionalPayment) => {
            return {
              amount: {
                amount: moveDecimal(
                  additionalPayment.amount,
                  -getTokenDecimalsWithFallback(token?.decimals),
                ),
                tokenAddress: additionalPayment.tokenAddress,
              },
              recipient: additionalPayment.recipientAddress,
            };
          }),
          ...repeatableFields,
        };
      }
      case ColonyActionType.MoveFunds:
      case ColonyActionType.MoveFundsMotion:
        return {
          [ACTION_TYPE_FIELD_NAME]: ACTION.TRANSFER_FUNDS,
          from: fromDomain?.nativeId.toString(),
          to: toDomain?.nativeId.toString(),
          amount: {
            amount,
            tokenAddress: token?.tokenAddress,
          },
          recipient: recipientAddress,
          ...repeatableFields,
        };
      case ColonyActionType.ColonyEdit:
      case ColonyActionType.ColonyEditMotion: {
        const modifiedTokens =
          action.pendingColonyMetadata?.modifiedTokenAddresses?.added?.map(
            (addedToken) => ({
              token: addedToken,
            }),
          );
        const colonyTokens = action.colony.tokens?.items?.map(
          (colonyToken) => ({
            token: colonyToken?.token?.tokenAddress,
          }),
        );
        const allTokens = [...(colonyTokens || []), ...(modifiedTokens || [])];

        if (modifiedTokens && modifiedTokens?.length > 0) {
          return {
            [ACTION_TYPE_FIELD_NAME]: ACTION.MANAGE_TOKENS,
            selectedTokenAddresses: allTokens,
            ...repeatableFields,
          };
        }

        return {
          [ACTION_TYPE_FIELD_NAME]: ACTION.EDIT_COLONY_DETAILS,
          colonyName: pendingColonyMetadata?.displayName,
          colonyAvatar:
            pendingColonyMetadata?.avatar || pendingColonyMetadata?.thumbnail,
          colonyDescription: pendingColonyMetadata?.description,
          externalLinks: pendingColonyMetadata?.externalLinks,
          ...repeatableFields,
        };
      }
      case ColonyActionType.CreateDomain:
      case ColonyActionType.CreateDomainMotion:
        return {
          [ACTION_TYPE_FIELD_NAME]: ACTION.CREATE_NEW_TEAM,
          teamName: action.isMotion
            ? pendingDomainMetadata?.name
            : fromDomain?.metadata?.name,
          domainColor: action.isMotion
            ? pendingDomainMetadata?.color
            : fromDomain?.metadata?.color,
          domainPurpose: action?.isMotion
            ? pendingDomainMetadata?.description
            : fromDomain?.metadata?.description,
          ...repeatableFields,
        };
      case ColonyActionType.EditDomain:
      case ColonyActionType.EditDomainMotion: {
        const changelog = fromDomain?.metadata?.changelog?.find(
          ({ transactionHash }) => transactionHash === action.transactionHash,
        );

        return {
          [ACTION_TYPE_FIELD_NAME]: ACTION.EDIT_EXISTING_TEAM,
          team: fromDomain?.nativeId?.toString(),
          teamName: isMotion ? pendingDomainMetadata?.name : changelog?.newName,
          domainColor: isMotion
            ? pendingDomainMetadata?.color
            : changelog?.newColor,
          domainPurpose: isMotion
            ? pendingDomainMetadata?.description
            : changelog?.newDescription,
          ...repeatableFields,
        };
      }
      case ColonyActionType.CreateDecisionMotion:
        return {
          [ACTION_TYPE_FIELD_NAME]: ACTION.CREATE_DECISION,
          createdIn: decisionData?.motionDomainId.toString(),
          title: decisionData?.title,
          description: decisionData?.description,
        };
      case ColonyActionType.UnlockToken:
      case ColonyActionType.UnlockTokenMotion:
        return {
          [ACTION_TYPE_FIELD_NAME]: ACTION.UNLOCK_TOKEN,
          ...repeatableFields,
        };
      case ColonyActionType.SetUserRoles:
      case ColonyActionType.SetUserRolesMotion: {
        const rolesList = convertRolesToArray(roles);
        const { role } = getRole(rolesList);

        return {
          [ACTION_TYPE_FIELD_NAME]: ACTION.MANAGE_PERMISSIONS,
          member: recipientAddress,
          authority: AUTHORITY.Own,
          role,
          team: fromDomain?.nativeId.toString(),
          permissions:
            role === USER_ROLE.Custom
              ? AVAILABLE_ROLES.reduce(
                  (result, currentRole) => ({
                    ...result,
                    [`role_${currentRole}`]: rolesList.includes(currentRole),
                  }),
                  {},
                )
              : undefined,
          ...repeatableFields,
        };
      }
      default:
        return undefined;
    }
  }, [action]);

  return {
    defaultValues,
    loadingAction,
    isMotion: action?.isMotion,
  };
};
