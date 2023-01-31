import React from 'react';
import Decimal from 'decimal.js';

import Numeral from '~shared/Numeral';
import { Colony, FormattedAction } from '~types';
import { formatRolesTitle } from '~utils/colonyActions';
import { findDomain } from '~utils/domains';
import {
  getFormattedTokenValue,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';
import FriendlyName from '~shared/FriendlyName';

import styles from '~shared/ListItem/ListItem.css';

const formatReputationChange = (decimals: string, reputationChange?: string) =>
  getFormattedTokenValue(
    new Decimal(reputationChange || '0').abs().toString(),
    decimals,
  );

export const mapItemToExpectedFormat = (
  item: FormattedAction,
  colony?: Colony,
) => {
  const formattedRolesTitle = formatRolesTitle(item.roles); // @TODO: item.actionType === ColonyMotions.SetUserRolesMotion ? updatedRoles : roles,
  const reputationChange = formatReputationChange(
    item.decimals,
    item.reputationChange,
  );
  return {
    ...item,
    amount: (
      <Numeral
        value={item.amount} // @TODO: getAmount(item.actionType, item.amount)
        decimals={getTokenDecimalsWithFallback(item.decimals)}
      />
    ),
    direction: formattedRolesTitle.direction,
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
    reputationChangeNumeral: <Numeral value={reputationChange} />,
    reputationChange,
    rolesChanged: formattedRolesTitle.roleTitle,
    toDomain: findDomain(item.toDomain, colony)?.name,
  };

  /*

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
};
