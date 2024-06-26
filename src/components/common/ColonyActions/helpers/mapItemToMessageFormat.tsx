import { AddressZero } from '@ethersproject/constants';
import Decimal from 'decimal.js';
import React from 'react';

import { type SimpleTarget } from '~gql';
import FriendlyName from '~shared/FriendlyName/index.ts';
import MaskedAddress from '~shared/MaskedAddress/index.ts';
import Numeral from '~shared/Numeral/index.ts';
import {
  type Colony,
  type ColonyAction,
  type DomainMetadata,
  type User,
  type ColonyExtension,
  type Token,
  type Expenditure,
} from '~types/graphql.ts';
import { notMaybe } from '~utils/arrays/index.ts';
import { formatRolesTitle } from '~utils/colonyActions.ts';
import { intl } from '~utils/intl.ts';
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

const getRecipientData = (
  actionData: ColonyAction,
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
  } = actionData;
  const safeRecipient = safeTransaction?.transactions?.items[0]?.recipient;

  return (
    [
      recipientUser,
      recipientColony,
      recipientExtension,
      recipientToken,
      safeRecipient,
      recipientAddress,
    ].find(notMaybe) || undefined
  );
};

const getRecipient = (actionData: ColonyAction) => {
  const recipient = getRecipientData(actionData);

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

export const mapColonyActionToExpectedFormat = ({
  actionData,
  colony,
  keyFallbackValues = {},
  expenditureData,
}: {
  actionData: ColonyAction;
  colony: Colony;
  keyFallbackValues?: Partial<Record<ActionTitleMessageKeys, React.ReactNode>>;
  expenditureData?: Expenditure;
}) => {
  //  // @TODO: item.actionType === ColonyMotions.SetUserRolesMotion ? updatedRoles : roles,
  const formattedRolesTitle = formatRolesTitle(actionData.roles);

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

  return {
    ...actionData,
    [ActionTitleMessageKeys.Amount]: getFormattedValueWithFallback(
      <Numeral
        value={actionData.amount ?? 0} // @TODO: getAmount(item.actionType, item.amount)
        decimals={getTokenDecimalsWithFallback(actionData.token?.decimals)}
      />,
      ActionTitleMessageKeys.Amount,
      notMaybe(actionData?.amount),
    ),
    [ActionTitleMessageKeys.Direction]: formattedRolesTitle,
    [ActionTitleMessageKeys.FromDomain]: getFormattedValueWithFallback(
      getDomainNameFromChangelog(
        actionData.transactionHash,
        actionData.fromDomain?.metadata || actionData.pendingDomainMetadata,
      ) ?? formatMessage({ id: 'unknownDomain' }),
      ActionTitleMessageKeys.FromDomain,
      notMaybe(
        actionData.fromDomain?.metadata || actionData.pendingDomainMetadata,
      ),
    ),
    [ActionTitleMessageKeys.Initiator]: getFormattedValueWithFallback(
      getInitiator(actionData),
      ActionTitleMessageKeys.Initiator,
      notMaybe(getInitiatorData(actionData)),
    ),
    [ActionTitleMessageKeys.Recipient]: getFormattedValueWithFallback(
      getRecipient(actionData),
      ActionTitleMessageKeys.Recipient,
      notMaybe(getRecipientData(actionData)),
    ),
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
            expenditureData?.slots?.[0].payouts?.[0].tokenAddress || '',
          )?.symbol
        : actionData.token?.symbol,
      ActionTitleMessageKeys.TokenSymbol,
      notMaybe(
        expenditureData
          ? getSelectedToken(
              colony,
              expenditureData?.slots?.[0].payouts?.[0].tokenAddress || '',
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
    [ActionTitleMessageKeys.RecipientsNumber]: new Set(
      expenditureData?.slots.map((slot) => slot.recipientAddress),
    ).size,
    [ActionTitleMessageKeys.TokensNumber]: new Set(
      expenditureData?.slots?.flatMap(
        (slot) => slot.payouts?.map((payout) => payout.tokenAddress) ?? [],
      ),
    ).size,
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
  };
};
