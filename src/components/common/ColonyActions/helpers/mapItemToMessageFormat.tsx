import React from 'react';

import Numeral from '~shared/Numeral';
import FriendlyName from '~shared/FriendlyName';
import { findDomain } from '~utils/domains';
import {
  getColonyMetadataMessageValues,
  getDomainMetadataTitleValues,
} from '~utils/events';
import {
  Colony,
  ColonyAndExtensionsEvents,
  ColonyAction,
  ColonyActionType,
} from '~types';

import { MockEvent } from '../mockData';
import { getDomainMetadataValues } from './getDomainValues';

import styles from './itemStyles.css';

export const mapColonyActionToExpectedFormat = (
  item: ColonyAction,
  colony?: Colony,
) => {
  // const formattedRolesTitle = formatRolesTitle(item.roles); // @TODO: item.actionType === ColonyMotions.SetUserRolesMotion ? updatedRoles : roles,
  // const reputationChange = formatReputationChange(
  //   item.decimals,
  //   item.reputationChange,
  // );

  return {
    ...item,
    amount: (
      <Numeral
        value={item.amount ?? 0} // @TODO: getAmount(item.actionType, item.amount)
        decimals={item.decimals ?? undefined}
      />
    ),
    // direction: formattedRolesTitle.direction,
    fromDomain: findDomain(item.fromDomain, colony)?.name,
    initiator: (
      <span className={styles.titleDecoration}>
        <FriendlyName user={item.initiator} autoShrinkAddress />
      </span>
    ),
    recipient: (
      <span className={styles.titleDecoration}>
        <FriendlyName user={item.recipient} autoShrinkAddress />
      </span>
    ),
    toDomain: findDomain(item.toDomain, colony)?.name,
    // reputationChangeNumeral: item.reputationChange && (
    //   <Numeral value={item.reputationChange} decimals={Number(item.decimals)} />
    // ),
    // reputationChange:
    //   item.reputationChange &&
    //   formatReputationChange(item.reputationChange, item.decimals),
    //rolesChanged: formattedRolesTitle.roleTitle,
  };
};

export const mapColonyEventToExpectedFormat = (
  event: MockEvent & { eventName: ColonyAndExtensionsEvents },
  item: ColonyAction,
  colony?: Colony,
) => {
  /*
   * TODO: Update the following to account for metadata changes being kept in the model as an array of changes,
   * with the latest one being the most recent one.
   */
  const colonyMetadataChanges = { namedChanged: true, logoChanged: true };
  // const role = item.roles[0];

  const {
    domainMetadataChanged,
    newDomainMetadata: { values: newValues, color: newColor },
    oldDomainMetadata: { values: oldValues, color: oldColor },
  } = getDomainMetadataTitleValues(
    event.previousDomainMetadata,
    event.domainMetadata,
  );

  return {
    ...item,
    ...event,
    ...getColonyMetadataMessageValues(colonyMetadataChanges, colony?.name),
    amount: (
      <Numeral
        value={item.amount ?? 0} // @TODO: getAmount(item.actionType, item.amount)
        decimals={item.decimals ?? undefined}
      />
    ),
    // ...getColonyRoleSetTitleValues(role?.setTo),
    domainMetadataChanged,
    newDomainMetadata: getDomainMetadataValues(newValues, newColor),
    oldDomainMetadata: getDomainMetadataValues(oldValues, oldColor),
    fromDomain: findDomain(item.fromDomain, colony)?.name,
    toDomain: findDomain(item.toDomain, colony)?.name,
    eventNameDecorated: <b>{event.eventName}</b>,
    //role: role && formatText({ id: `role.${role.id}` }),
    clientOrExtensionType: (
      <span className={styles.highlight}>{event.emittedBy}</span>
    ),
    initiator: (
      <span className={styles.userDecoration}>
        <FriendlyName user={item.initiator} autoShrinkAddress />
      </span>
    ),
    recipient: (
      <span className={styles.userDecoration}>
        <FriendlyName user={item.recipient} autoShrinkAddress />
      </span>
    ),
    isSmiteAction: item.type === ColonyActionType.EmitDomainReputationPenalty,
    // reputationChange:
    //   item.reputationChange &&
    //   formatReputationChange(item.reputationChange, item.decimals),
    // reputationChangeNumeral: item.reputationChange && (
    //   <Numeral value={item.reputationChange} decimals={Number(item.decimals)} />
    // ),
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
