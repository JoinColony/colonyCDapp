import { Id } from '@colony/colony-js';
import moveDecimal from 'move-decimal-point';
import { useMemo } from 'react';

import { Action } from '~constants/actions.ts';
import { getRole, UserRole } from '~constants/permissions.ts';
import { ColonyActionType } from '~gql';
import { convertRolesToArray } from '~transformers/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { Authority } from '~types/authority.ts';
import { getExtendedActionType } from '~utils/colonyActions.ts';
import {
  getSelectedToken,
  getTokenDecimalsWithFallback,
} from '~utils/tokens.ts';
import { getFormattedTokenAmount } from '~v5/common/CompletedAction/partials/utils.ts';

import { ACTION_TYPE_FIELD_NAME } from '../consts.ts';
import { AVAILABLE_ROLES } from '../partials/forms/ManagePermissionsForm/consts.ts';

import useGetColonyAction from './useGetColonyAction.ts';
import { useGetExpenditureData } from './useGetExpenditureData.ts';
import { useGetStreamingPaymentData } from './useGetStreamingPaymentData.ts';

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
  const {
    streamingPaymentData,
    loadingStreamingPayment,
    paymentStatus,
    amounts,
    refetchStreamingPayment,
    updateAmountsAndStatus,
  } = useGetStreamingPaymentData(action?.expenditureId);

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
      decisionMethod: action.isMotion
        ? DecisionMethod.Reputation
        : DecisionMethod.Permissions,
    };

    switch (extendedType) {
      case ColonyActionType.MintTokens:
      case ColonyActionType.MintTokensMotion:
        return {
          [ACTION_TYPE_FIELD_NAME]: Action.MintTokens,
          amount: {
            amount,
            tokenAddress: token?.tokenAddress,
          },
          ...repeatableFields,
        };
      case ColonyActionType.Payment:
      case ColonyActionType.PaymentMotion: {
        return {
          [ACTION_TYPE_FIELD_NAME]: Action.SimplePayment,
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
      case ColonyActionType.MultiplePayment:
      case ColonyActionType.MultiplePaymentMotion: {
        const [firstPayment, ...additionalPayments] = payments || [];

        return {
          [ACTION_TYPE_FIELD_NAME]: Action.SimplePayment,
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
      case ColonyActionType.MoveFunds:
      case ColonyActionType.MoveFundsMotion:
        return {
          [ACTION_TYPE_FIELD_NAME]: Action.TransferFunds,
          from: fromDomain?.nativeId,
          to: toDomain?.nativeId,
          amount: {
            amount,
            tokenAddress: token?.tokenAddress,
          },
          recipient: recipientAddress,
          ...repeatableFields,
        };
      case ColonyActionType.ColonyEdit:
      case ColonyActionType.ColonyEditMotion: {
        return {
          [ACTION_TYPE_FIELD_NAME]: Action.EditColonyDetails,
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
      case ColonyActionType.CreateDomain:
      case ColonyActionType.CreateDomainMotion:
        return {
          [ACTION_TYPE_FIELD_NAME]: Action.CreateNewTeam,
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
          [ACTION_TYPE_FIELD_NAME]: Action.EditExistingTeam,
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
      case ColonyActionType.CreateDecisionMotion:
        return {
          [ACTION_TYPE_FIELD_NAME]: Action.CreateDecision,
          createdIn: decisionData?.motionDomainId,
          title: decisionData?.title,
          description: decisionData?.description,
          decisionMethod: action.isMotion
            ? DecisionMethod.Reputation
            : DecisionMethod.Permissions,
        };
      case ColonyActionType.UnlockToken:
      case ColonyActionType.UnlockTokenMotion:
        return {
          [ACTION_TYPE_FIELD_NAME]: Action.UnlockToken,
          ...repeatableFields,
        };
      case ColonyActionType.CreateExpenditure: {
        return {
          [ACTION_TYPE_FIELD_NAME]: Action.PaymentBuilder,
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
      case ColonyActionType.SetUserRoles:
      case ColonyActionType.SetUserRolesMotion: {
        const rolesList = convertRolesToArray(roles);
        const { role } = getRole(rolesList);

        return {
          [ACTION_TYPE_FIELD_NAME]: Action.ManagePermissions,
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
    streamingPayment: {
      streamingPaymentData,
      loadingStreamingPayment,
      paymentStatus,
      amounts,
      refetchStreamingPayment,
      updateAmountsAndStatus,
    },
    startPollingForAction,
    stopPollingForAction,
  };
};

export default useGetActionData;
