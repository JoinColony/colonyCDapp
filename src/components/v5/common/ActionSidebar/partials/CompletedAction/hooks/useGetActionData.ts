import { Id } from '@colony/colony-js';
import moveDecimal from 'move-decimal-point';
import { useMemo } from 'react';

import { CoreAction } from '~actions/index.ts';
import { getRole, UserRole } from '~constants/permissions.ts';
import { DecisionMethod } from '~gql';
import useGetColonyAction from '~hooks/useGetColonyAction.ts';
import useGetExpenditureData from '~hooks/useGetExpenditureData.ts';
import { convertRolesToArray } from '~transformers/index.ts';
import { Authority } from '~types/authority.ts';
import { getExtendedActionType } from '~utils/colonyActions.ts';
import {
  getSelectedToken,
  getTokenDecimalsWithFallback,
} from '~utils/tokens.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import { AVAILABLE_ROLES } from '~v5/common/ActionSidebar/partials/forms/core/ManagePermissionsForm/consts.ts';

import { getFormattedTokenAmount } from '../partials/utils.ts';

// FIXME: Needs to go into actionDefinition as well
const useGetActionData = (transactionId: string | undefined) => {
  const {
    action,
    isInvalidTransactionHash,
    loadingAction,
    networkMotionState,
    motionState,
    startPollingForAction,
    stopPollingForAction,
  } = useGetColonyAction(transactionId);
  const { expenditure, loadingExpenditure } = useGetExpenditureData(
    action?.expenditureId,
  );

  const defaultValues = useMemo(() => {
    if (!action) {
      return undefined;
    }

    const {
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
      colony,
    } = action;

    const { metadata: expenditureMetadata, slots } = expenditure || {};

    const extendedType = getExtendedActionType(action, colony.metadata);
    const { metadata } = colony;

    const repeatableFields = {
      createdIn: isMotion ? motionData?.motionDomain.nativeId : Id.RootDomain,
      description: annotation?.message,
      title: action.metadata?.customTitle,
      // FIXME: Can be removed once we have action.decisionMethod
      decisionMethod: action.isMotion
        ? DecisionMethod.Reputation
        : DecisionMethod.Permissions,
    };

    switch (extendedType) {
      case CoreAction.MintTokens:
      case CoreAction.MintTokensMotion:
        return {
          [ACTION_TYPE_FIELD_NAME]: CoreAction.MintTokens,
          amount: {
            amount,
            tokenAddress: token?.tokenAddress,
          },
          ...repeatableFields,
        };
      case CoreAction.Payment:
      case CoreAction.PaymentMotion: {
        return {
          [ACTION_TYPE_FIELD_NAME]: CoreAction.Payment,
          amount: {
            amount: moveDecimal(
              amount,
              -getTokenDecimalsWithFallback(token?.decimals),
            ),
            tokenAddress: token?.tokenAddress,
          },
          from: fromDomain?.nativeId,
          recipient: recipientAddress,
          ...repeatableFields,
        };
      }
      case CoreAction.MultiplePayment:
      case CoreAction.MultiplePaymentMotion: {
        const [firstPayment, ...additionalPayments] = payments || [];

        return {
          [ACTION_TYPE_FIELD_NAME]: CoreAction.Payment,
          from: fromDomain?.nativeId,
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
      case CoreAction.MoveFunds:
      case CoreAction.MoveFundsMotion:
        return {
          [ACTION_TYPE_FIELD_NAME]: CoreAction.MoveFunds,
          from: fromDomain?.nativeId,
          to: toDomain?.nativeId,
          amount: {
            amount,
            tokenAddress: token?.tokenAddress,
          },
          recipient: recipientAddress,
          ...repeatableFields,
        };
      case CoreAction.ColonyEdit:
      case CoreAction.ColonyEditMotion: {
        return {
          [ACTION_TYPE_FIELD_NAME]: CoreAction.ColonyEdit,
          colonyName: motionData
            ? pendingColonyMetadata?.displayName
            : metadata?.displayName,
          avatar: motionData
            ? {
                image: pendingColonyMetadata?.avatar,
                thumbnail: pendingColonyMetadata?.thumbnail,
              }
            : {
                image: metadata?.avatar,
                thumbnail: metadata?.thumbnail,
              },
          colonyDescription: motionData
            ? pendingColonyMetadata?.description
            : metadata?.description,
          externalLinks: motionData
            ? pendingColonyMetadata?.externalLinks
            : metadata?.externalLinks,
          ...repeatableFields,
        };
      }
      case CoreAction.CreateDomain:
      case CoreAction.CreateDomainMotion:
        return {
          [ACTION_TYPE_FIELD_NAME]: CoreAction.CreateDomain,
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
      case CoreAction.EditDomain:
      case CoreAction.EditDomainMotion: {
        const changelog = fromDomain?.metadata?.changelog?.find(
          ({ transactionHash }) => transactionHash === action.transactionHash,
        );

        return {
          [ACTION_TYPE_FIELD_NAME]: CoreAction.EditDomain,
          team: fromDomain?.nativeId,
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
      case CoreAction.CreateDecisionMotion:
        return {
          [ACTION_TYPE_FIELD_NAME]: CoreAction.CreateDecisionMotion,
          createdIn: decisionData?.motionDomainId,
          title: decisionData?.title,
          description: decisionData?.description,
          decisionMethod: action.isMotion
            ? DecisionMethod.Reputation
            : DecisionMethod.Permissions,
        };
      case CoreAction.UnlockToken:
      case CoreAction.UnlockTokenMotion:
        return {
          [ACTION_TYPE_FIELD_NAME]: CoreAction.UnlockToken,
          ...repeatableFields,
        };
      case CoreAction.CreateExpenditure: {
        return {
          [ACTION_TYPE_FIELD_NAME]: CoreAction.CreateExpenditure,
          from: expenditureMetadata?.fundFromDomainNativeId,
          payments: slots?.map((slot) => {
            if (!slot) {
              return undefined;
            }
            const currentToken = getSelectedToken(
              colony,
              slot.payouts?.[0].tokenAddress || '',
            );

            const currentAmount = getFormattedTokenAmount(
              slot?.payouts?.[0].amount || '0',
              currentToken?.decimals,
            );

            return {
              recipient: slot.recipientAddress,
              amount: currentAmount.toString(),
              tokenAddress: slot.payouts?.[0].tokenAddress,
              delay:
                slot.claimDelay && Math.floor(Number(slot.claimDelay) / 3600),
            };
          }),
          ...repeatableFields,
        };
      }
      case CoreAction.SetUserRoles:
      case CoreAction.SetUserRolesMotion: {
        const rolesList = convertRolesToArray(roles);
        const { role } = getRole(rolesList);

        return {
          [ACTION_TYPE_FIELD_NAME]: CoreAction.SetUserRoles,
          member: recipientAddress,
          authority: Authority.Own,
          role,
          team: fromDomain?.nativeId,
          permissions:
            role === UserRole.Custom
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
  }, [action, expenditure]);

  return {
    action,
    defaultValues,
    isInvalidTransactionHash,
    loadingAction,
    isMotion: !!action?.isMotion,
    isMultiSig: !!action?.isMultiSig,
    networkMotionState,
    motionState,
    expenditure,
    loadingExpenditure,
    startPollingForAction,
    stopPollingForAction,
  };
};

export default useGetActionData;
