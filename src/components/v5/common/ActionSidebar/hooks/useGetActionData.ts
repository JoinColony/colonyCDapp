import { Id } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';
import { useMemo } from 'react';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { Action } from '~constants/actions.ts';
import { getRole, UserRole } from '~constants/permissions.ts';
import { ColonyActionType } from '~gql';
import { useGetAllTokens } from '~hooks/useGetAllTokens.ts';
import { convertRolesToArray } from '~transformers/index.ts';
import { DecisionMethod, ExtendedColonyActionType } from '~types/actions.ts';
import { Authority } from '~types/authority.ts';
import { getExtendedActionType } from '~utils/colonyActions.ts';
import { convertToDecimal } from '~utils/convertToDecimal.ts';
import { convertPeriodToHours } from '~utils/extensions.ts';
import {
  getNumeralTokenAmount,
  getSelectedToken,
  getTokenDecimalsWithFallback,
} from '~utils/tokens.ts';

import {
  ACTION_TYPE_FIELD_NAME,
  AMOUNT_FIELD_NAME,
  FROM_FIELD_NAME,
  RECIPIENT_FIELD_NAME,
  TEAM_FIELD_NAME,
  TOKEN_FIELD_NAME,
} from '../consts.ts';
import { AVAILABLE_PERMISSIONS } from '../partials/forms/ManagePermissionsForm/consts.ts';
import { ModificationOption } from '../partials/forms/ManageReputationForm/consts.ts';
import { calculatePercentageValue } from '../partials/forms/SplitPaymentForm/partials/SplitPaymentRecipientsField/utils.ts';

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
  const allTokens = useGetAllTokens();
  const {
    streamingPaymentData,
    loadingStreamingPayment,
    refetchStreamingPayment,
  } = useGetStreamingPaymentData(action?.streamingPaymentId);

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

    let decisionMethod: DecisionMethod | undefined;

    if (action.isMotion) {
      decisionMethod = DecisionMethod.Reputation;
    } else if (action.isMultiSig) {
      decisionMethod = DecisionMethod.MultiSig;
    } else if (expenditure?.isStaked) {
      decisionMethod = DecisionMethod.Staking;
    } else {
      decisionMethod = DecisionMethod.Permissions;
    }

    const repeatableFields = {
      createdIn: isMotion ? motionData?.motionDomain.nativeId : Id.RootDomain,
      description: annotation?.message,
      title: action.metadata?.customTitle,
      decisionMethod,
    };

    switch (extendedType) {
      case ColonyActionType.MintTokens:
      case ColonyActionType.MintTokensMotion:
        return {
          [ACTION_TYPE_FIELD_NAME]: Action.MintTokens,
          amount: convertToDecimal(
            amount || '',
            getTokenDecimalsWithFallback(token?.decimals),
          )?.toString(),
          tokenAddress: token?.tokenAddress,
          ...repeatableFields,
        };
      case ColonyActionType.Payment:
      case ColonyActionType.PaymentMotion: {
        return {
          [ACTION_TYPE_FIELD_NAME]: Action.SimplePayment,
          amount: moveDecimal(
            amount,
            -getTokenDecimalsWithFallback(token?.decimals),
          ),
          tokenAddress: token?.tokenAddress,
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
          amount: moveDecimal(
            firstPayment.amount,
            -getTokenDecimalsWithFallback(token?.decimals),
          ),
          tokenAddress: firstPayment.tokenAddress,
          recipient: firstPayment.recipientAddress,
          payments: additionalPayments.map((additionalPayment) => {
            return {
              amount: moveDecimal(
                additionalPayment.amount,
                -getTokenDecimalsWithFallback(token?.decimals),
              ),
              tokenAddress: additionalPayment.tokenAddress,
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
          amount: convertToDecimal(
            amount || '',
            getTokenDecimalsWithFallback(token?.decimals),
          )?.toString(),
          tokenAddress: token?.tokenAddress,
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
          [FROM_FIELD_NAME]: expenditureMetadata?.fundFromDomainNativeId,
          payments: slots?.map((slot) => {
            const paymentToken = allTokens.find(
              ({ token: currentToken }) =>
                currentToken.tokenAddress === slot.payouts?.[0].tokenAddress,
            );

            return {
              recipient: slot.recipientAddress,
              amount: moveDecimal(
                slot.payouts?.[0].amount ?? '0',
                -getTokenDecimalsWithFallback(paymentToken?.token.decimals),
              ),
              tokenAddress: slot.payouts?.[0].tokenAddress,
              delay: convertPeriodToHours(slot.claimDelay || '0'),
            };
          }),
          ...repeatableFields,
        };
      }
      case ExtendedColonyActionType.StagedPayment: {
        return {
          [ACTION_TYPE_FIELD_NAME]: Action.StagedPayment,
          [FROM_FIELD_NAME]: fromDomain?.nativeId,
          [RECIPIENT_FIELD_NAME]: expenditure?.slots?.[0]?.recipientAddress,
          stages: (expenditure?.metadata?.stages || []).map((stage) => {
            const currentSlot = slots?.find((slot) => slot.id === stage.slotId);
            const stagedToken = allTokens.find(
              ({ token: currentToken }) =>
                currentToken.tokenAddress ===
                currentSlot?.payouts?.[0].tokenAddress,
            );

            return {
              milestone: stage.name,
              amount: moveDecimal(
                currentSlot?.payouts?.[0].amount ?? '0',
                -getTokenDecimalsWithFallback(stagedToken?.token.decimals),
              ),
              tokenAddress: currentSlot?.payouts?.[0].tokenAddress,
            };
          }),
          ...repeatableFields,
        };
      }
      case ExtendedColonyActionType.SplitPayment: {
        const splitToken =
          !!slots?.length &&
          !!slots[0].payouts?.length &&
          slots[0].payouts[0].tokenAddress
            ? getSelectedToken(colony, slots[0].payouts[0].tokenAddress)
            : undefined;
        const splitAmount = slots
          ?.flatMap((slot) => slot.payouts || [])
          .reduce((acc, curr) => {
            return BigNumber.from(acc)
              .add(BigNumber.from(curr?.amount || '0'))
              .toString();
          }, '0');
        const formattedAmount = moveDecimal(
          splitAmount,
          -getTokenDecimalsWithFallback(splitToken?.decimals),
        );

        return {
          [ACTION_TYPE_FIELD_NAME]: Action.SplitPayment,
          distributionMethod: expenditure?.metadata?.distributionType,
          [TEAM_FIELD_NAME]: expenditure?.metadata?.fundFromDomainNativeId,
          [AMOUNT_FIELD_NAME]: formattedAmount,
          payments: slots?.map((slot) => {
            const currentAmount = moveDecimal(
              slot.payouts?.[0].amount ?? '0',
              -getTokenDecimalsWithFallback(splitToken?.decimals),
            );

            return {
              recipient: slot.recipientAddress,
              amount: currentAmount,
              tokenAddress: slot.payouts?.[0].tokenAddress,
              percent: calculatePercentageValue(currentAmount, formattedAmount),
            };
          }),
          [TOKEN_FIELD_NAME]: splitToken?.tokenAddress,
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
          authority: action.rolesAreMultiSig
            ? Authority.ViaMultiSig
            : Authority.Own,
          role,
          team: fromDomain?.nativeId,
          permissions:
            role === UserRole.Custom
              ? AVAILABLE_PERMISSIONS.reduce(
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
      case ColonyActionType.EmitDomainReputationReward:
      case ColonyActionType.EmitDomainReputationRewardMotion:
      case ColonyActionType.EmitDomainReputationRewardMultisig:
      case ColonyActionType.EmitDomainReputationPenalty:
      case ColonyActionType.EmitDomainReputationPenaltyMotion:
      case ColonyActionType.EmitDomainReputationPenaltyMultisig: {
        const isSmite = [
          ColonyActionType.EmitDomainReputationPenalty,
          ColonyActionType.EmitDomainReputationPenaltyMotion,
          ColonyActionType.EmitDomainReputationPenaltyMultisig,
        ].includes(action.type);

        const positiveAmountValue = BigNumber.from(amount || '0')
          .abs()
          .toString();

        const formattedAmount = getNumeralTokenAmount(
          positiveAmountValue,
          DEFAULT_TOKEN_DECIMALS,
        );

        return {
          [ACTION_TYPE_FIELD_NAME]: Action.ManageReputation,
          member: recipientAddress,
          modification: isSmite
            ? ModificationOption.RemoveReputation
            : ModificationOption.AwardReputation,
          [TEAM_FIELD_NAME]: fromDomain?.nativeId,
          [AMOUNT_FIELD_NAME]: formattedAmount,
          ...repeatableFields,
        };
      }
      default:
        return undefined;
    }
  }, [action, expenditure, allTokens]);

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
      refetchStreamingPayment,
    },
    startPollingForAction,
    stopPollingForAction,
  };
};

export default useGetActionData;
