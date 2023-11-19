import React from 'react';
import Decimal from 'decimal.js';
import { AddressZero } from '@ethersproject/constants';

import Numeral from '~shared/Numeral';
import FriendlyName from '~shared/FriendlyName';
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
import { useColonyContext, useUserReputation } from '~hooks';
import { MotionVote } from '~utils/colonyMotions';
import { intl } from '~utils/intl';
import { formatReputationChange } from '~utils/reputation';
import { DEFAULT_TOKEN_DECIMALS, SAFE_NAMES_MAP } from '~constants';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import {
  formatRolesTitle,
  getColonyRoleSetTitleValues,
} from '~utils/colonyActions';
import {
  AmountTag,
  Motion as MotionTag,
  Objected as ObjectionTag,
  Voting as VotingTag,
  Failed as FailedTag,
  Reveal as RevealTag,
  Passed as PassedTag,
} from '~shared/Tag';
import { VoteResults } from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/VoteOutcome/VoteResults';
import { VotingWidgetHeading } from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/VotingWidget';
import MemberReputation from '~shared/MemberReputation';
import MaskedAddress from '~shared/MaskedAddress';
import {
  getAddedSafe,
  getAddedSafeChainName,
  getRemovedSafes,
} from '~utils/safes';
import { unknownContractMSG } from '~shared/DetailsWidget/SafeTransactionDetail';

import { getDomainMetadataChangesValue } from './getDomainMetadataChanges';
import { getColonyMetadataChangesValue } from './getColonyMetadataChanges';

import styles from './itemStyles.css';
import { SimpleTarget } from '~gql';

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

const getRecipient = (actionData: ColonyAction) => {
  const {
    recipientUser,
    recipientColony,
    recipientExtension,
    recipientToken,
    safeTransaction,
  } = actionData;
  const safeRecipient = safeTransaction?.transactions?.items[0]?.recipient;

  let recipient:
    | User
    | Colony
    | ColonyExtension
    | Token
    | SimpleTarget
    | undefined;

  if (recipientUser) {
    recipient = recipientUser;
  } else if (recipientColony) {
    recipient = recipientColony;
  } else if (recipientExtension) {
    recipient = recipientExtension;
  } else if (recipientToken) {
    recipient = recipientToken;
  } else if (safeRecipient) {
    recipient = safeRecipient;
  }

  return (
    <span className={styles.userDecoration}>
      {recipient ? (
        <FriendlyName agent={recipient} autoShrinkAddress />
      ) : (
        <MaskedAddress address={actionData.recipientAddress || AddressZero} />
      )}
    </span>
  );
};

const getInitiator = (actionData: ColonyAction) => {
  const { initiatorUser, initiatorColony, initiatorExtension, initiatorToken } =
    actionData;

  let initiator: User | Colony | ColonyExtension | Token | undefined;

  if (initiatorUser) {
    initiator = initiatorUser;
  } else if (initiatorColony) {
    initiator = initiatorColony;
  } else if (initiatorExtension) {
    initiator = initiatorExtension;
  } else if (initiatorToken) {
    initiator = initiatorToken;
  }

  return (
    <span className={styles.userDecoration}>
      {initiator ? (
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
  colony?: Colony,
) => {
  //  // @TODO: item.actionType === ColonyMotions.SetUserRolesMotion ? updatedRoles : roles,
  const formattedRolesTitle = formatRolesTitle(actionData.roles);

  return {
    ...actionData,
    amount: (
      <Numeral
        value={actionData.amount ?? 0} // @TODO: getAmount(item.actionType, item.amount)
        decimals={actionData.token?.decimals ?? DEFAULT_TOKEN_DECIMALS}
      />
    ),
    direction: formattedRolesTitle.direction,
    fromDomain:
      getDomainNameFromChangelog(
        actionData.transactionHash,
        actionData.fromDomain?.metadata || actionData.pendingDomainMetadata,
      ) ?? formatMessage({ id: 'unknownDomain' }),
    initiator: getInitiator(actionData),
    recipient: getRecipient(actionData),
    toDomain:
      actionData.toDomain?.metadata?.name ??
      formatMessage({ id: 'unknownDomain' }),
    tokenSymbol: actionData.token?.symbol,
    reputationChangeNumeral: actionData.amount && (
      <Numeral
        value={new Decimal(actionData.amount).abs()}
        decimals={getTokenDecimalsWithFallback(colony?.nativeToken.decimals)}
      />
    ),
    reputationChange:
      actionData.amount &&
      formatReputationChange(
        actionData.amount,
        getTokenDecimalsWithFallback(colony?.nativeToken.decimals),
      ),
    rolesChanged: formattedRolesTitle.roleTitle,
    newVersion: actionData.newColonyVersion,
    chainName: getAddedSafeChainName(actionData),
    safeTransactionTitle: actionData.metadata?.customTitle,
  };
};

export const mapActionEventToExpectedFormat = (
  eventName: ColonyAndExtensionsEvents,
  actionData: ColonyAction,
  eventId?: string,
  colony?: Colony,
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
        getTokenDecimalsWithFallback(colony?.nativeToken.decimals),
      ),
    newVersion: actionData.newColonyVersion,
    reputationChangeNumeral: actionData.amount && (
      <Numeral
        value={actionData.amount}
        decimals={getTokenDecimalsWithFallback(colony?.nativeToken.decimals)}
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
  const { colony } = useColonyContext();

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
          decimals={colony?.nativeToken.decimals ?? undefined}
          suffix={colony?.nativeToken.symbol ?? ''}
        />
      </AmountTag>
    ),
    backedSideTag:
      Number(motionMessageData?.vote) === MotionVote.Yay ? (
        <MotionTag />
      ) : (
        <ObjectionTag />
      ),
    motionTag: <MotionTag />,
    objectionTag: <ObjectionTag />,
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
