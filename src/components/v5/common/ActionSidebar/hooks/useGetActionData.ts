import { useMemo } from 'react';
import moveDecimal from 'move-decimal-point';

import { ACTION } from '~constants/actions';
import { ColonyActionType } from '~gql';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { useNetworkInverseFee } from '~hooks';
import { getAmountLessFee } from '~utils/networkFee';

import { ACTION_TYPE_FIELD_NAME } from '../consts';
import { useGetColonyAction } from './useGetColonyAction';

export const useGetActionData = (transactionId: string | undefined) => {
  const { action, loadingAction } = useGetColonyAction(transactionId);
  const { networkInverseFee } = useNetworkInverseFee();

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
    } = action;

    const repeatableFields = {
      createdIn: motionData?.motionDomain.nativeId.toString(),
      description: annotation?.message,
      // @TODO: handle title and decision if it will be available in api
      // title: action.title,
      // decisionMethod: action.decisionMethod
    };

    switch (type) {
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
        const amountLessFee = networkInverseFee
          ? getAmountLessFee(amount ?? 0, networkInverseFee)
          : amount;

        return {
          [ACTION_TYPE_FIELD_NAME]: ACTION.SIMPLE_PAYMENT,
          amount: {
            amount: moveDecimal(
              amountLessFee,
              -getTokenDecimalsWithFallback(token?.decimals),
            ),
            tokenAddress: token?.tokenAddress,
          },
          from: fromDomain?.nativeId.toString(),
          recipient: recipientAddress,
          ...repeatableFields,
        };
      }
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
      case ColonyActionType.CreateDomainMotion:
        return {
          [ACTION_TYPE_FIELD_NAME]: ACTION.CREATE_NEW_TEAM,
          teamName: pendingDomainMetadata?.name,
          domainColor: pendingDomainMetadata?.color,
          domainPurpose: pendingDomainMetadata?.description,
          ...repeatableFields,
        };
      case ColonyActionType.EditDomainMotion:
        return {
          [ACTION_TYPE_FIELD_NAME]: ACTION.EDIT_EXISTING_TEAM,
          team: motionData?.motionDomain?.nativeId?.toString(),
          teamName: pendingDomainMetadata?.name,
          domainColor: pendingDomainMetadata?.color,
          domainPurpose: pendingDomainMetadata?.description,
          ...repeatableFields,
        };
      case ColonyActionType.CreateDecisionMotion:
        return {
          [ACTION_TYPE_FIELD_NAME]: ACTION.CREATE_DECISION,
          createdIn: decisionData?.motionDomainId.toString(),
          title: decisionData?.title,
          description: decisionData?.description,
        };
      default:
        return undefined;
    }
  }, [action, networkInverseFee]);

  return {
    defaultValues,
    loadingAction,
    isMotion: action?.isMotion,
  };
};
