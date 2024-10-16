import { AddressZero } from '@ethersproject/constants';
import Decimal from 'decimal.js';
import React from 'react';

import { ActionTitleKey, type ActionData, CoreAction } from '~actions';
import { type SimpleTarget } from '~gql';
import FriendlyName from '~shared/FriendlyName/index.ts';
import MaskedAddress from '~shared/MaskedAddress/index.ts';
import Numeral from '~shared/Numeral/index.ts';
import { type OptionalValue } from '~types';
import {
  type Colony,
  type DomainMetadata,
  type User,
  type ColonyExtension,
  type Token,
  type Expenditure,
} from '~types/graphql.ts';
import { notMaybe } from '~utils/arrays/index.ts';
import { formatRolesTitle } from '~utils/colonyActions.ts';
import { getRecipientsNumber, getTokensNumber } from '~utils/expenditures.ts';
import { formatText, intl } from '~utils/intl.ts';
import { formatReputationChange } from '~utils/reputation.ts';
import { getAddedSafeChainName } from '~utils/safes/index.ts';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';

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
  actionData: ActionData,
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

const getRecipient = (actionData: ActionData) => {
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
  actionData: ActionData,
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

const getInitiator = (actionData: ActionData) => {
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
  actionData: ActionData;
  colony: Pick<Colony, 'nativeToken'>;
  keyFallbackValues?: Partial<Record<ActionTitleKey, React.ReactNode>>;
  expenditureData?: Expenditure;
}) => {
  //  // @TODO: item.actionType === ColonyMotions.SetUserRolesMotion ? updatedRoles : roles,
  const formattedRolesTitle = formatRolesTitle(actionData.roles);

  const getFormattedValueWithFallback = (
    value: React.ReactNode,
    fallbackKey: ActionTitleKey,
    condition: boolean,
  ) => {
    if (condition || !(fallbackKey in keyFallbackValues)) {
      return value;
    }

    return keyFallbackValues[fallbackKey];
  };

  let fromDomainKeyMetadata: OptionalValue<DomainMetadata>;

  if (actionData.type.includes('DOMAIN')) {
    // when dealing with domain actions, the subtitle to display depends
    // on the type of domain action dispatched

    // If a domain is being created via the Permissions decision method,
    // strictly use the fromDomain metadata
    if (actionData.type === CoreAction.CreateDomain) {
      fromDomainKeyMetadata = actionData.fromDomain?.metadata;
    } else {
      // For all other scenarios, conditionally set the metadata
      const shouldUsePendingDomainMetadata = [
        CoreAction.CreateDomainMotion,
        CoreAction.CreateDomainMultisig,
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

  return {
    ...actionData,
    [ActionTitleKey.Amount]: getFormattedValueWithFallback(
      <Numeral
        value={actionData.amount ?? 0} // @TODO: getAmount(item.actionType, item.amount)
        decimals={getTokenDecimalsWithFallback(actionData.token?.decimals)}
      />,
      ActionTitleKey.Amount,
      notMaybe(actionData?.amount),
    ),
    [ActionTitleKey.Direction]: formattedRolesTitle,
    [ActionTitleKey.FromDomain]: getFormattedValueWithFallback(
      getDomainNameFromChangelog(
        actionData.transactionHash,
        fromDomainKeyMetadata,
      ) ?? formatMessage({ id: 'unknownDomain' }),
      ActionTitleKey.FromDomain,
      notMaybe(fromDomainKeyMetadata),
    ),
    [ActionTitleKey.Initiator]: getFormattedValueWithFallback(
      getInitiator(actionData),
      ActionTitleKey.Initiator,
      notMaybe(getInitiatorData(actionData)),
    ),
    [ActionTitleKey.Recipient]: getFormattedValueWithFallback(
      getRecipient(actionData),
      ActionTitleKey.Recipient,
      notMaybe(getRecipientData(actionData)),
    ),
    [ActionTitleKey.ToDomain]: getFormattedValueWithFallback(
      actionData.toDomain?.metadata?.name ??
        formatMessage({ id: 'unknownDomain' }),
      ActionTitleKey.ToDomain,
      notMaybe(actionData.toDomain?.metadata?.name),
    ),
    [ActionTitleKey.TokenSymbol]: getFormattedValueWithFallback(
      actionData.token?.symbol,
      ActionTitleKey.TokenSymbol,
      notMaybe(actionData.token?.symbol),
    ),
    [ActionTitleKey.ReputationChangeNumeral]: getFormattedValueWithFallback(
      actionData.amount && (
        <Numeral
          value={new Decimal(actionData.amount).abs()}
          decimals={getTokenDecimalsWithFallback(colony?.nativeToken.decimals)}
        />
      ),
      ActionTitleKey.ReputationChangeNumeral,
      notMaybe(actionData.amount),
    ),
    [ActionTitleKey.ReputationChange]: getFormattedValueWithFallback(
      actionData.amount &&
        formatReputationChange(
          actionData.amount,
          getTokenDecimalsWithFallback(colony?.nativeToken.decimals),
        ),
      ActionTitleKey.ReputationChange,
      !!actionData.amount,
    ),
    [ActionTitleKey.NewVersion]: getFormattedValueWithFallback(
      actionData.newColonyVersion,
      ActionTitleKey.NewVersion,
      notMaybe(actionData.newColonyVersion),
    ),
    [ActionTitleKey.Version]: getFormattedValueWithFallback(
      (actionData.newColonyVersion ?? 1) - 1,
      ActionTitleKey.Version,
      notMaybe(actionData.newColonyVersion),
    ),
    [ActionTitleKey.ChainName]: getFormattedValueWithFallback(
      getAddedSafeChainName(actionData),
      ActionTitleKey.ChainName,
      getAddedSafeChainName(actionData),
    ),
    [ActionTitleKey.SafeTransactionTitle]: getFormattedValueWithFallback(
      actionData.metadata?.customTitle,
      ActionTitleKey.SafeTransactionTitle,
      notMaybe(actionData.metadata?.customTitle),
    ),
    [ActionTitleKey.Members]: actionData.members?.length || 0,
    [ActionTitleKey.RecipientsNumber]: getRecipientsNumber(expenditureData),
    [ActionTitleKey.TokensNumber]: getTokensNumber(expenditureData),
    [ActionTitleKey.MultiSigAuthority]: actionData.rolesAreMultiSig
      ? `${formatText({
          id: 'decisionMethod.multiSig',
        })} `
      : '',
  };
};
