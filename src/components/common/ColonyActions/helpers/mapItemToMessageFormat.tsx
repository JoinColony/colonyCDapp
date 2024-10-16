import { AddressZero } from '@ethersproject/constants';
import Decimal from 'decimal.js';
import React from 'react';

import { ACTIONS_WITH_NETWORK_FEE } from '~constants/actions.ts';
import { ColonyActionType, type SimpleTarget } from '~gql';
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
} from '~types/graphql.ts';
import { notMaybe } from '~utils/arrays/index.ts';
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
  networkInverseFee,
}: {
  actionData: ColonyAction;
  colony: Pick<Colony, 'nativeToken' | 'tokens'>;
  keyFallbackValues?: Partial<Record<ActionTitleMessageKeys, React.ReactNode>>;
  expenditureData?: Expenditure;
  networkInverseFee?: string;
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
