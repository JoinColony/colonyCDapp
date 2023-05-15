import React from 'react';
import Decimal from 'decimal.js';

import Numeral from '~shared/Numeral';
import FriendlyName from '~shared/FriendlyName';
import {
  Colony,
  ColonyAndExtensionsEvents,
  ColonyAction,
  ColonyActionType,
  DomainMetadata,
  MotionMessage,
  MotionData,
} from '~types';
import { useColonyContext } from '~hooks';
import { MotionVote } from '~utils/colonyMotions';
import { intl } from '~utils/intl';
import { formatReputationChange } from '~utils/reputation';
import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import {
  AmountTag,
  Motion as MotionTag,
  Objection as ObjectionTag,
  Voting as VotingTag,
  Failed as FailedTag,
} from '~shared/Tag';
import { useGetUserByAddressQuery } from '~gql';
import { VoteResults } from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/VoteOutcome/VoteResults';
import { VotingWidgetHeading } from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/VotingWidget';

import { getDomainMetadataChangesValue } from './getDomainMetadataChanges';
import { getColonyMetadataChangesValue } from './getColonyMetadataChanges';

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

export const mapColonyActionToExpectedFormat = (
  actionData: ColonyAction,
  colony?: Colony,
) => {
  // const formattedRolesTitle = formatRolesTitle(item.roles); // @TODO: item.actionType === ColonyMotions.SetUserRolesMotion ? updatedRoles : roles,

  return {
    ...actionData,
    amount: (
      <Numeral
        value={actionData.amount ?? 0} // @TODO: getAmount(item.actionType, item.amount)
        decimals={actionData.token?.decimals ?? DEFAULT_TOKEN_DECIMALS}
      />
    ),
    // direction: formattedRolesTitle.direction,
    fromDomain:
      getDomainNameFromChangelog(
        actionData.transactionHash,
        actionData.fromDomain?.metadata || actionData.pendingDomainMetadata,
      ) ?? formatMessage({ id: 'unknownDomain' }),
    initiator: (
      <span className={styles.titleDecoration}>
        <FriendlyName user={actionData.initiatorUser} autoShrinkAddress />
      </span>
    ),
    recipient: (
      <span className={styles.titleDecoration}>
        <FriendlyName user={actionData.recipient} autoShrinkAddress />
      </span>
    ),
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
    // rolesChanged: formattedRolesTitle.roleTitle,
    newVersion: actionData.newColonyVersion,
  };
};

export const mapActionEventToExpectedFormat = (
  eventName: ColonyAndExtensionsEvents,
  actionData: ColonyAction,
  colony?: Colony,
) => {
  // const role = item.roles[0];

  return {
    amount: (
      <Numeral
        value={actionData.amount ?? 0} // @TODO: getAmount(item.actionType, item.amount)
        decimals={actionData.token?.decimals ?? DEFAULT_TOKEN_DECIMALS}
      />
    ),
    // ...getColonyRoleSetTitleValues(role?.setTo),
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
    // role: role && formatText({ id: `role.${role.id}` }),
    // clientOrExtensionType: (
    //   <span className={styles.highlight}>{event.emittedBy}</span>
    // ),
    initiator: (
      <span className={styles.userDecoration}>
        <FriendlyName user={actionData.initiatorUser} autoShrinkAddress />
      </span>
    ),
    recipient: (
      <span className={styles.userDecoration}>
        <FriendlyName user={actionData.recipient} autoShrinkAddress />
      </span>
    ),
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
  };
};

export const useMapMotionEventToExpectedFormat = (
  motionMessageData: MotionMessage,
  actionType: ColonyActionType,
  motionData?: MotionData | null,
) => {
  const { colony } = useColonyContext();
  const { data } = useGetUserByAddressQuery({
    skip: !motionMessageData?.initiatorAddress,
    variables: {
      address: motionMessageData?.initiatorAddress ?? '',
    },
  });
  if (!motionData) {
    return {};
  }
  const initiatorUser = data?.getUserByAddress?.items[0];

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
    voteResultsWidget: (
      <div className={styles.voteResultsWrapper}>
        <VotingWidgetHeading actionType={actionType} />
        <VoteResults
          revealedVotes={motionData.revealedVotes}
          voterRecord={motionData.voterRecord}
        />
      </div>
    ),
    initiator: (
      <span className={styles.userDecoration}>
        <FriendlyName user={initiatorUser} autoShrinkAddress />
      </span>
    ),
    staker: (
      <span className={styles.userDecoration}>
        <FriendlyName user={initiatorUser} autoShrinkAddress />
      </span>
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
