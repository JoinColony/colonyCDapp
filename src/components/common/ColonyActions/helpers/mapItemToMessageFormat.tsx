import React from 'react';
// import Decimal from 'decimal.js';

import Numeral from '~shared/Numeral';
// import { formatRolesTitle } from '~utils/colonyActions';
import FriendlyName from '~shared/FriendlyName';
import ColorTag from '~shared/ColorTag';
import Tag from '~shared/Tag';
import { findDomain } from '~utils/domains';
import {
  getFormattedTokenValue,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';
import { Colony, graphQlDomainColorMap, ColonyAction } from '~types';

import { MockEvent } from '../mockData';

import actionStyles from '~shared/ListItem/ListItem.css';
import eventStyles from '~common/ColonyActions/ActionsPage/ActionsPageFeed/ActionsPageEvent/ActionsPageEvent.css';
import {
  getColonyMetadataMessageValues,
  getColonyRoleSetTitleValues,
  getDomainMetadataTitleValues,
} from '~utils/events';
import { formatText } from '~utils/intl';
import { DomainColor } from '~gql';

// const formatReputationChange = (decimals: string, reputationChange?: string) =>
//   getFormattedTokenValue(
//     new Decimal(reputationChange || '0').abs().toString(),
//     decimals,
//   );

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
        decimals={getTokenDecimalsWithFallback(item.decimals)}
      />
    ),
    // direction: formattedRolesTitle.direction,
    fromDomain: findDomain(item.fromDomain ?? '', colony)?.name,
    initiator: (
      <span className={actionStyles.titleDecoration}>
        <FriendlyName user={item.initiator} autoShrinkAddress />
      </span>
    ),
    recipient: (
      <span className={actionStyles.titleDecoration}>
        <FriendlyName user={item.recipient} autoShrinkAddress />
      </span>
    ),
    // reputationChangeNumeral: <Numeral value={reputationChange} />,
    // reputationChange,
    // rolesChanged: formattedRolesTitle.roleTitle,
    toDomain: findDomain(item.toDomain ?? '', colony)?.name,
  };
};

const getNewDomainMetadataValues = (
  newValues: string,
  newColor?: DomainColor,
) => {
  return formatText(
    {
      id: 'domainMetadata.newValues',
      defaultMessage: `{newValues}{newColor}`,
    },
    {
      newValues,
      newColor: newColor && (
        <ColorTag color={graphQlDomainColorMap[newColor]} />
      ),
    },
  );
};

const getOldDomainMetadataValues = (
  oldValues: string,
  oldColor?: DomainColor,
) =>
  formatText(
    {
      id: 'domainMetadata.oldValues',
      defaultMessage: `{oldValues}{oldColor}`,
    },
    {
      oldValues,
      oldColor: oldColor && (
        <ColorTag color={graphQlDomainColorMap[oldColor]} />
      ),
    },
  );

export const mapColonyEventToExpectedFormat = (
  item: MockEvent,
  colony?: Colony,
) => {
  const colonyMetadataChanges = { namedChanged: true, logoChanged: true };
  const role = item.roles[0];
  const decimalStakeAmount = getFormattedTokenValue(
    item.stakeAmount || 0,
    item.decimals,
  );

  const {
    domainMetadataChanged,
    newDomainMetadata: { values: newValues, color: newColor },
    oldDomainMetadata: { values: oldValues, color: oldColor },
  } = getDomainMetadataTitleValues(
    item.previousDomainMetadata,
    item.domainMetadata,
  );

  return {
    ...item,
    ...getColonyMetadataMessageValues(colonyMetadataChanges, colony?.name),
    ...getColonyRoleSetTitleValues(role.setTo),
    domainMetadataChanged,
    newDomainMetadata: getNewDomainMetadataValues(newValues, newColor),
    oldDomainMetadata: getOldDomainMetadataValues(oldValues, oldColor),
    fromDomain: findDomain(item.fromDomain, colony)?.name,
    toDomain: findDomain(item.toDomain, colony)?.name,
    eventNameDecorated: <b>{item.eventName}</b>,
    role: formatText({ id: `role.${role.id}` }),
    clientOrExtensionType: (
      <span className={eventStyles.highlight}>{item.emittedBy}</span>
    ),
    initiator: (
      <span className={eventStyles.userDecoration}>
        <FriendlyName user={item.initiator} autoShrinkAddress />
      </span>
    ),
    recipient: (
      <span className={eventStyles.userDecoration}>
        <FriendlyName user={item.recipient} autoShrinkAddress />
      </span>
    ),
    amountTag: (
      <div className={eventStyles.amountTag}>
        <Tag
          appearance={{
            theme: 'primary',
            colorSchema: 'inverted',
            fontSize: 'tiny',
            margin: 'none',
          }}
          text=""
        >
          <Numeral value={decimalStakeAmount} suffix={item.tokenSymbol} />
        </Tag>
      </div>
    ),
    reputationChangeNumeral: (
      <Numeral value={item.reputationChange} decimals={Number(item.decimals)} />
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
