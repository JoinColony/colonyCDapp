import { AddressZero } from '@ethersproject/constants';
import Decimal from 'decimal.js';
import { BigNumber } from 'ethers';
import React from 'react';

import { ACTIONS_WITH_NETWORK_FEE } from '~constants/actions.ts';
import { getNetworkTokenList } from '~constants/tokens/getNetworkTokenList.ts';
import { ColonyActionType, type TokenFragment, type SimpleTarget } from '~gql';
import useUserByAddress from '~hooks/useUserByAddress.ts';
import FriendlyName from '~shared/FriendlyName/index.ts';
import MaskedAddress from '~shared/MaskedAddress/index.ts';
import Numeral from '~shared/Numeral/index.ts';
import { type OptionalValue } from '~types';
import {
  type Colony,
  type ColonyAction,
  type DomainMetadata,
  type User,
  type ColonyExtension,
  type Token,
  type Expenditure,
  type ExpenditureStage,
  type ExpenditureSlot,
} from '~types/graphql.ts';
import { notMaybe, notNull } from '~utils/arrays/index.ts';
import { formatRolesTitle } from '~utils/colonyActions.ts';
import { getRecipientsNumber, getTokensNumber } from '~utils/expenditures.ts';
import { getAmountLessFee } from '~utils/getAmountLessFee.ts';
import { formatText, intl } from '~utils/intl.ts';
import { formatReputationChange } from '~utils/reputation.ts';
import { getAddedSafeChainName } from '~utils/safes/index.ts';
import {
  getSelectedToken,
  getTokenDecimalsWithFallback,
} from '~utils/tokens.ts';

import { ActionTitleMessageKeys } from './getActionTitleValues.ts';

const { formatMessage } = intl({
  unknownDomain: 'UnknownDomain',
});

// Get the domain name at the time of a transaction with a given hash (or fallback to the current name)
const getDomainNameFromChangelog = (
  transactionHash: string,
  domainMetadata?: DomainMetadata | null,
) => {
  if (!domainMetadata) {
    return null;
  }

  const changelogItem = domainMetadata.changelog?.find(
    (item) => item.transactionHash === transactionHash,
  );
  if (!changelogItem?.newName) {
    return domainMetadata.name;
  }
  return changelogItem.newName;
};

const useGetRecipientData = (
  actionData: ColonyAction | null | undefined,
  expenditure: Expenditure | null | undefined,
):
  | User
  | Colony
  | ColonyExtension
  | Token
  | SimpleTarget
  | string
  | undefined => {
  const {
    recipientUser,
    recipientColony,
    recipientExtension,
    recipientToken,
    safeTransaction,
    recipientAddress,
  } = actionData || {};
  const safeRecipient = safeTransaction?.transactions?.items[0]?.recipient;
  const stagedPaymentRecipientAddress =
    expenditure?.slots[0].recipientAddress || '';
  const stagedPaymentRecipient = useUserByAddress(
    stagedPaymentRecipientAddress,
  );

  return (
    [
      recipientUser,
      recipientColony,
      recipientExtension,
      recipientToken,
      safeRecipient,
      recipientAddress,
      stagedPaymentRecipient.user,
    ].find(notMaybe) || undefined
  );
};

const useGetRecipient = (
  actionData: ColonyAction | null | undefined,
  expenditure: Expenditure | null | undefined,
) => {
  const recipient = useGetRecipientData(actionData, expenditure);

  return (
    <span>
      {typeof recipient !== 'string' ? (
        <FriendlyName agent={recipient} autoShrinkAddress />
      ) : (
        <MaskedAddress address={recipient || AddressZero} />
      )}
    </span>
  );
};

const getInitiatorData = (
  actionData: ColonyAction,
): User | Colony | ColonyExtension | Token | string | undefined => {
  const {
    initiatorUser,
    initiatorColony,
    initiatorExtension,
    initiatorToken,
    initiatorAddress,
  } = actionData;

  return (
    [
      initiatorUser,
      initiatorColony,
      initiatorExtension,
      initiatorToken,
      initiatorAddress,
    ].find(notMaybe) || undefined
  );
};

const getInitiator = (actionData: ColonyAction) => {
  const initiator = getInitiatorData(actionData);

  return (
    <span>
      {typeof initiator !== 'string' ? (
        <FriendlyName agent={initiator} autoShrinkAddress />
      ) : (
        <MaskedAddress address={actionData.initiatorAddress || AddressZero} />
      )}
    </span>
  );
};

interface ExpenditureStagesData {
  summedAmount: string;
  stagedPaymentToken: TokenFragment | null | undefined;
}

const getExpenditureStagesData = (
  stages: ExpenditureStage[],
  slots: ExpenditureSlot[],
  colony: Pick<Colony, 'tokens'>,
) => {
  const predefinedTokens = getNetworkTokenList();
  const colonyTokens = colony.tokens?.items.filter(notNull) || [];
  const allTokens = [...colonyTokens, ...predefinedTokens];

  const tokensSet = new Set(
    slots.flatMap(
      (slot) => slot.payouts?.map((payout) => payout.tokenAddress) ?? [],
    ),
  );

  const hasSingleTokenType = tokensSet.size === 1;

  if (!hasSingleTokenType) {
    return {
      summedAmount: '0',
      stagedPaymentToken: null,
    };
  }

  const result = stages.reduce<ExpenditureStagesData>(
    (acc, stage): ExpenditureStagesData => {
      const currentSlot = slots.find((slot) => slot.id === stage.slotId);
      const tokenAddress = currentSlot?.payouts?.[0]?.tokenAddress;

      const token = allTokens.find(
        ({ token: currentToken }) => currentToken.tokenAddress === tokenAddress,
      );

      return {
        summedAmount: BigNumber.from(acc.summedAmount)
          .add(BigNumber.from(currentSlot?.payouts?.[0]?.amount || '0'))
          .toString(),
        stagedPaymentToken: acc.stagedPaymentToken || token?.token,
      };
    },
    {
      summedAmount: BigNumber.from('0').toString(),
      stagedPaymentToken: null,
    },
  );

  return {
    summedAmount: result.summedAmount.toString(),
    stagedPaymentToken: result.stagedPaymentToken,
  };
};

export const useMapColonyActionToExpectedFormat = ({
  actionData,
  colony,
  keyFallbackValues = {},
  expenditureData,
  networkInverseFee,
}: {
  actionData: ColonyAction | null | undefined;
  colony: Pick<Colony, 'nativeToken' | 'tokens'> | undefined;
  keyFallbackValues?: Partial<Record<ActionTitleMessageKeys, React.ReactNode>>;
  expenditureData?: Expenditure;
  networkInverseFee?: string;
}) => {
  const getFormattedValueWithFallback = (
    value: React.ReactNode,
    fallbackKey: ActionTitleMessageKeys,
    condition: boolean,
  ) => {
    if (condition || !(fallbackKey in keyFallbackValues)) {
      return value;
    }

    return keyFallbackValues[fallbackKey];
  };

  const recipient = getFormattedValueWithFallback(
    useGetRecipient(actionData, expenditureData),
    ActionTitleMessageKeys.Recipient,
    notMaybe(useGetRecipientData(actionData, expenditureData)),
  );
  if (!actionData || !colony) {
    return {};
  }
  //  // @TODO: item.actionType === ColonyMotions.SetUserRolesMotion ? updatedRoles : roles,
  const formattedRolesTitle = formatRolesTitle(actionData.roles);

  const getAmount = (
    actionType: ColonyActionType,
    amount?: string | null,
    networkFee?: string | null,
  ) => {
    if (!amount) {
      return 0;
    }

    const actionTypeUsesNetworkFee = ACTIONS_WITH_NETWORK_FEE.has(actionType);

    if (!actionTypeUsesNetworkFee) {
      return amount;
    }

    return getAmountLessFee(amount, networkFee, networkInverseFee);
  };

  let fromDomainKeyMetadata: OptionalValue<DomainMetadata>;

  if (actionData.type.includes('DOMAIN')) {
    // when dealing with domain actions, the subtitle to display depends
    // on the type of domain action dispatched

    // If a domain is being created via the Permissions decision method,
    // strictly use the fromDomain metadata
    if (actionData.type === ColonyActionType.CreateDomain) {
      fromDomainKeyMetadata = actionData.fromDomain?.metadata;
    } else {
      // For all other scenarios, conditionally set the metadata
      const shouldUsePendingDomainMetadata = [
        ColonyActionType.CreateDomainMotion,
        ColonyActionType.CreateDomainMultisig,
      ].includes(actionData.type);

      fromDomainKeyMetadata = shouldUsePendingDomainMetadata
        ? actionData.pendingDomainMetadata
        : actionData.fromDomain?.metadata;
    }
  } else {
    // When not dealing with domain actions, preserve the original behaviour
    // whereby fromDomain?.metadata is prioritised over pendingDomainMetadata
    fromDomainKeyMetadata =
      actionData.fromDomain?.metadata || actionData.pendingDomainMetadata;
  }

  const { stagedPaymentToken, summedAmount } = getExpenditureStagesData(
    expenditureData?.metadata?.stages || [],
    expenditureData?.slots || [],
    colony,
  );

  return {
    ...actionData,
    [ActionTitleMessageKeys.Amount]: getFormattedValueWithFallback(
      <Numeral
        value={getAmount(
          actionData.type,
          actionData.amount,
          actionData.networkFee,
        )}
        decimals={getTokenDecimalsWithFallback(actionData.token?.decimals)}
      />,
      ActionTitleMessageKeys.Amount,
      notMaybe(actionData?.amount),
    ),
    [ActionTitleMessageKeys.Direction]: formattedRolesTitle,
    [ActionTitleMessageKeys.FromDomain]: getFormattedValueWithFallback(
      getDomainNameFromChangelog(
        actionData.transactionHash,
        fromDomainKeyMetadata,
      ) ?? formatMessage({ id: 'unknownDomain' }),
      ActionTitleMessageKeys.FromDomain,
      notMaybe(fromDomainKeyMetadata),
    ),
    [ActionTitleMessageKeys.Initiator]: getFormattedValueWithFallback(
      getInitiator(actionData),
      ActionTitleMessageKeys.Initiator,
      notMaybe(getInitiatorData(actionData)),
    ),
    [ActionTitleMessageKeys.Recipient]: recipient,
    [ActionTitleMessageKeys.ToDomain]: getFormattedValueWithFallback(
      actionData.toDomain?.metadata?.name ??
        formatMessage({ id: 'unknownDomain' }),
      ActionTitleMessageKeys.ToDomain,
      notMaybe(actionData.toDomain?.metadata?.name),
    ),
    [ActionTitleMessageKeys.TokenSymbol]: getFormattedValueWithFallback(
      expenditureData
        ? getSelectedToken(
            colony,
            expenditureData?.slots?.[0]?.payouts?.[0]?.tokenAddress || '',
          )?.symbol
        : actionData.token?.symbol,
      ActionTitleMessageKeys.TokenSymbol,
      notMaybe(
        expenditureData
          ? getSelectedToken(
              colony,
              expenditureData?.slots?.[0]?.payouts?.[0]?.tokenAddress || '',
            )?.symbol
          : actionData.token?.symbol,
      ),
    ),
    [ActionTitleMessageKeys.ReputationChangeNumeral]:
      getFormattedValueWithFallback(
        actionData.amount && (
          <Numeral
            value={new Decimal(actionData.amount).abs()}
            decimals={getTokenDecimalsWithFallback(
              colony?.nativeToken.decimals,
            )}
          />
        ),
        ActionTitleMessageKeys.ReputationChangeNumeral,
        notMaybe(actionData.amount),
      ),
    [ActionTitleMessageKeys.ReputationChange]: getFormattedValueWithFallback(
      actionData.amount &&
        formatReputationChange(
          actionData.amount,
          getTokenDecimalsWithFallback(colony?.nativeToken.decimals),
        ),
      ActionTitleMessageKeys.ReputationChange,
      !!actionData.amount,
    ),
    [ActionTitleMessageKeys.NewVersion]: getFormattedValueWithFallback(
      actionData.newColonyVersion,
      ActionTitleMessageKeys.NewVersion,
      notMaybe(actionData.newColonyVersion),
    ),
    [ActionTitleMessageKeys.Version]: getFormattedValueWithFallback(
      (actionData.newColonyVersion ?? 1) - 1,
      ActionTitleMessageKeys.Version,
      notMaybe(actionData.newColonyVersion),
    ),
    [ActionTitleMessageKeys.ChainName]: getFormattedValueWithFallback(
      getAddedSafeChainName(actionData),
      ActionTitleMessageKeys.ChainName,
      getAddedSafeChainName(actionData),
    ),
    [ActionTitleMessageKeys.SafeTransactionTitle]:
      getFormattedValueWithFallback(
        actionData.metadata?.customTitle,
        ActionTitleMessageKeys.SafeTransactionTitle,
        notMaybe(actionData.metadata?.customTitle),
      ),
    [ActionTitleMessageKeys.Members]: actionData.members?.length || 0,
    [ActionTitleMessageKeys.RecipientsNumber]:
      getRecipientsNumber(expenditureData),
    [ActionTitleMessageKeys.TokensNumber]: getTokensNumber(expenditureData),
    [ActionTitleMessageKeys.MultiSigAuthority]: actionData.rolesAreMultiSig
      ? `${formatText({
          id: 'decisionMethod.multiSig',
        })} `
      : '',
    [ActionTitleMessageKeys.StagedAmount]: (
      <Numeral
        value={summedAmount}
        decimals={getTokenDecimalsWithFallback(stagedPaymentToken?.decimals)}
      />
    ),
    [ActionTitleMessageKeys.SplitAmount]: getFormattedValueWithFallback(
      <Numeral
        value={
          expenditureData?.slots
            .flatMap((slot) => slot.payouts || [])
            .reduce(
              (acc, curr) =>
                new Decimal(acc)
                  .add(new Decimal(curr?.amount || '0'))
                  .toString(),
              '0',
            ) || '0'
        }
        decimals={getTokenDecimalsWithFallback(
          getSelectedToken(
            colony,
            !!expenditureData?.slots?.length &&
              !!expenditureData?.slots[0].payouts?.length
              ? expenditureData.slots[0].payouts[0].tokenAddress
              : '',
          )?.decimals,
          colony?.nativeToken.decimals,
        )}
      />,
      ActionTitleMessageKeys.SplitAmount,
      !!expenditureData?.slots,
    ),
    [ActionTitleMessageKeys.RecipientsNumber]: new Set(
      expenditureData?.slots.map((slot) => slot.recipientAddress),
    ).size,
    [ActionTitleMessageKeys.TokensNumber]: new Set(
      expenditureData?.slots?.flatMap(
        (slot) => slot.payouts?.map((payout) => payout.tokenAddress) ?? [],
      ),
    ).size,
    // @todo: update this to use the actual period value
    [ActionTitleMessageKeys.Period]: 'Day',
  };
};
