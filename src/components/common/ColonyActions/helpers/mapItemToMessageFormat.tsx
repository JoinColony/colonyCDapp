import { AddressZero } from '@ethersproject/constants';
import Decimal from 'decimal.js';
import React from 'react';

import { VoteResults } from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/VoteOutcome/VoteResults';
import { VotingWidgetHeading } from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/VotingWidget';
import { DEFAULT_TOKEN_DECIMALS, SAFE_NAMES_MAP } from '~constants';
import { SimpleTarget } from '~gql';
import { useColonyContext, useUserReputation } from '~hooks';
import { unknownContractMSG } from '~shared/DetailsWidget/SafeTransactionDetail';
import FriendlyName from '~shared/FriendlyName';
import MaskedAddress from '~shared/MaskedAddress';
import MemberReputation from '~shared/MemberReputation';
import Numeral from '~shared/Numeral';
import {
  AmountTag,
  Motion as MotionTag,
  Opposed as OpposedTag,
  Voting as VotingTag,
  Failed as FailedTag,
  Reveal as RevealTag,
  Passed as PassedTag,
} from '~shared/Tag';
import {
  Colony,
  ColonyAndExtensionsEvents,
  ColonyAction,
  ColonyActionType,
  DomainMetadata,
  MotionMessage,
  User,
  ColonyExtension,
  Token,
  SafeTransactionData,
} from '~types';
import { notMaybe } from '~utils/arrays';
import {
  formatRolesTitle,
  getColonyRoleSetTitleValues,
} from '~utils/colonyActions';
import { MotionVote } from '~utils/colonyMotions';
import { intl } from '~utils/intl';
import { formatReputationChange } from '~utils/reputation';
import {
  getAddedSafe,
  getAddedSafeChainName,
  getRemovedSafes,
} from '~utils/safes';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import { ActionTitleMessageKeys } from './getActionTitleValues';
import { getColonyMetadataChangesValue } from './getColonyMetadataChanges';
import { getDomainMetadataChangesValue } from './getDomainMetadataChanges';

import styles from './itemStyles.css';

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

const getSafeAddress = (actionData: ColonyAction) => {
  const addedSafe = getAddedSafe(actionData);

  return addedSafe ? <MaskedAddress address={addedSafe.address} /> : null;
};

const getSafeName = (actionData: ColonyAction) => {
  const transactionSafeName = actionData?.safeTransaction?.safe?.name;

  return <span className={styles.user}>@{transactionSafeName}</span>;
};

const getSafeTransactionAmount = (
  firstSafeTransaction?: SafeTransactionData,
) => (
  <>
    <Numeral value={firstSafeTransaction?.amount || ''} />
    <span> {firstSafeTransaction?.token?.symbol}</span>
  </>
);

const getSafeTransactionNftToken = (
  firstSafeTransaction?: SafeTransactionData,
) => (
  <span className={styles.user}>
    {firstSafeTransaction?.nftData?.name ||
      firstSafeTransaction?.nftData?.tokenName}
  </span>
);

const getRemovedSafesString = (actionData: ColonyAction) => {
  const removedSafes = getRemovedSafes(actionData);
  let removedSafeFullMessage: JSX.Element | null = null;

  removedSafes?.forEach((safe, index) => {
    const removedSafe = (
      <>
        <span>{`${safe.name} (${SAFE_NAMES_MAP[safe.chainId]}) `}</span>
        <MaskedAddress address={safe.address} />
      </>
    );

    if (index === 0) {
      removedSafeFullMessage = removedSafe;
    } else if (index === removedSafes.length - 1) {
      removedSafeFullMessage = (
        <>
          {removedSafeFullMessage} and {removedSafe}
        </>
      );
    } else {
      removedSafeFullMessage = (
        <>
          {removedSafeFullMessage}, {removedSafe}
        </>
      );
    }
  });

  return removedSafeFullMessage;
};

export const mapColonyActionToExpectedFormat = (
  actionData: ColonyAction,
  colony: Colony,
  keyFallbackValues: Partial<
    Record<ActionTitleMessageKeys, React.ReactNode>
  > = {},
) => {
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
    [ActionTitleMessageKeys.Direction]: formattedRolesTitle.direction,
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
      actionData.token?.symbol,
      ActionTitleMessageKeys.TokenSymbol,
      notMaybe(actionData.token?.symbol),
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
    [ActionTitleMessageKeys.RolesChanged]: formattedRolesTitle.roleTitle,
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
  };
};

export const mapActionEventToExpectedFormat = (
  eventName: ColonyAndExtensionsEvents,
  actionData: ColonyAction,
  colony: Colony,
  eventId?: string,
) => {
  const firstSafeTransaction =
    actionData?.safeTransaction?.transactions?.items[0] || undefined;

  return {
    amount: (
      <Numeral
        value={actionData.amount ?? 0} // @TODO: getAmount(item.actionType, item.amount)
        decimals={actionData.token?.decimals ?? DEFAULT_TOKEN_DECIMALS}
      />
    ),
    ...getColonyRoleSetTitleValues(actionData.individualEvents, eventId),
    domainMetadataChanges: getDomainMetadataChangesValue(actionData),
    colonyMetadataChanges: getColonyMetadataChangesValue(actionData, colony),
    fromDomain:
      getDomainNameFromChangelog(
        actionData.transactionHash,
        actionData.fromDomain?.metadata || actionData.pendingDomainMetadata,
      ) ?? formatMessage({ id: 'unknownDomain' }),
    toDomain:
      actionData.toDomain?.metadata?.name ??
      formatMessage({ id: 'unknownDomain' }),
    eventNameDecorated: <b>{eventName}</b>,
    // clientOrExtensionType: (
    //   <span className={styles.highlight}>{event.emittedBy}</span>
    // ),
    initiator: getInitiator(actionData),
    recipient: getRecipient(actionData),
    isSmiteAction:
      actionData.type === ColonyActionType.EmitDomainReputationPenalty,
    tokenSymbol: actionData.token?.symbol,
    reputationChange:
      actionData.amount &&
      formatReputationChange(
        actionData.amount,
        getTokenDecimalsWithFallback(colony.nativeToken.decimals),
      ),
    newVersion: actionData.newColonyVersion,
    reputationChangeNumeral: actionData.amount && (
      <Numeral
        value={actionData.amount}
        decimals={getTokenDecimalsWithFallback(colony.nativeToken.decimals)}
      />
    ),
    chainName: getAddedSafeChainName(actionData),
    safeAddress: getSafeAddress(actionData),
    removedSafes: getRemovedSafesString(actionData),
    safeName: getSafeName(actionData),
    safeTransactionAmount: getSafeTransactionAmount(firstSafeTransaction),
    nftToken: getSafeTransactionNftToken(firstSafeTransaction),
    functionName: firstSafeTransaction?.contractFunction || '',
    contractName:
      firstSafeTransaction?.contract?.profile.displayName ||
      formatMessage(unknownContractMSG),
    isSafeTransactionRecipientUser: !(
      firstSafeTransaction?.recipient?.id === 'filterValue'
    ),
  };
};

export const useMapMotionEventToExpectedFormat = (
  motionMessageData: MotionMessage,
  actionData: ColonyAction,
) => {
  const { colonyAddress, motionData, pendingColonyMetadata } = actionData;
  const { nativeMotionDomainId } = motionData || {};
  const {
    colony: { nativeToken },
  } = useColonyContext();

  const initiatorUserReputation = useUserReputation(
    colonyAddress,
    motionMessageData.initiatorAddress,
    Number(nativeMotionDomainId),
    motionData?.rootHash,
  );

  if (!motionData) {
    return {};
  }

  return {
    eventNameDecorated: <b>{motionMessageData?.name}</b>,
    amountTag: (
      <AmountTag>
        <Numeral
          value={motionMessageData?.amount ?? 0}
          decimals={nativeToken.decimals}
          suffix={nativeToken.symbol}
        />
      </AmountTag>
    ),
    backedSideTag:
      Number(motionMessageData?.vote) === MotionVote.Yay ? (
        <MotionTag />
      ) : (
        <OpposedTag />
      ),
    motionTag: <MotionTag />,
    objectionTag: <OpposedTag />,
    votingTag: <VotingTag />,
    failedTag: <FailedTag />,
    revealTag: <RevealTag />,
    passedTag: <PassedTag />,
    voteResultsWidget: (
      <div className={styles.voteResultsWrapper}>
        <VotingWidgetHeading
          actionData={actionData}
          pendingColonyMetadata={pendingColonyMetadata}
        />
        <VoteResults
          revealedVotes={motionData.revealedVotes}
          voterRecord={
            motionData.voterRecord.map((voter) => ({
              address: voter.address,
              voteCount: voter.voteCount,
              vote: voter.vote ?? undefined,
            })) || []
          }
        />
      </div>
    ),
    initiator: (
      <>
        <span className={styles.userDecoration}>
          <FriendlyName
            agent={motionMessageData.initiatorUser}
            autoShrinkAddress
          />
        </span>
        <div className={styles.reputation}>
          <MemberReputation
            userReputation={initiatorUserReputation?.userReputation}
            totalReputation={initiatorUserReputation?.totalReputation}
          />
        </div>
      </>
    ),
    staker: (
      <>
        <span className={styles.userDecoration}>
          <FriendlyName
            agent={motionMessageData.initiatorUser}
            autoShrinkAddress
          />
        </span>
        <div className={styles.reputation}>
          <MemberReputation
            userReputation={initiatorUserReputation?.userReputation}
            totalReputation={initiatorUserReputation?.totalReputation}
          />
        </div>
      </>
    ),
  };
};

/*
Actions
======
Note that the following transformations also exist in the Dapp. Because they are async,
it would be ideal if they were handled higher up in the CDapp, and passed down. That would
avoid the need to add async logic to this component (i.e. useEffect).
(If necessary, however, this could be handled in a custom hook.)
1.
const updatedRoles = getUpdatedDecodedMotionRoles(
  recipientUser,
  parseInt(fromDomainId, 10),
  historicColonyRoles?.historicColonyRoles as unknown as ColonyRoles,
  roles || [],
);
Requires historic roles:
const getColonyHistoricRoles = async (
  colonyAddress: Address,
  blockNumber: number,
) => {
  const colonyManager = getContext(ContextModule.ColonyManager);
  const colonyClient = await colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );
  return getHistoricColonyRoles(colonyClient);
};
2.
const version = await networkClient.getCurrentColonyVersion();
const feeInverse = await networkClient.getFeeInverse();
const changedData = {
    version:
        /*
            * @NOTE Always return the version of the colony contracts that is
            * supported by colonyJS (otherwise the app breaks)
            *
            * So if the version from the network resolver is greater than the
            * current colonyJS supported version, limit it to the version
            * returned by colonyJS

    version.toNumber() <= CurrentColonyVersion
            ? version.toString()
            : String(CurrentColonyVersion),
        /*
        * Network fee inverse as defined by the ColonyNetwork contract.
        * If the current fee is 1%, this will be `100`.
    feeInverse: feeInverse.toString()
}
const getNetworkFeePercentage = (networkFeeInverse: string) =>
  BigNumber.from(100).div(networkFeeInverse);
const calculatePaymentReceived = (
  feePercentage: BigNumber,
  paymentAmount: BigNumberish,
) =>
  BigNumber.from(paymentAmount)
    .mul(BigNumber.from(100).sub(feePercentage))
    .div(100);
// In case it is a Payment Motion or Action, calculate the payment the recipient gets, after network fees
const getAmount = (
  actionType: ColonyActions | ColonyMotions,
  amount: string,
) => {
  if (
    actionType === ColonyActions.Payment ||
    actionType === ColonyMotions.PaymentMotion
  ) {
    const networkFeeInverse = '100'; // @TODO get from network...
    const feePercentage = getNetworkFeePercentage(networkFeeInverse);
    return calculatePaymentReceived(feePercentage, amount);
  }
  return amount;
};
3.
const [fetchTokenInfo, { data: tokenData }] = useTokenInfoQuery({
   { variables: { address: transactionTokenAddress } }
 });
const symbol = tokenData?.tokenInfo?.symbol || colonyTokenSymbol;
const decimals =  tokenData?.tokenInfo?.decimals || Number(colonyTokenDecimals);
*/
