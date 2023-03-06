import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useColonyContext } from '~hooks';
import { ADDRESS_ZERO } from '~constants';

import UnclaimedTransfersItem from './UnclaimedTransfersItem';

import styles from './UnclaimedTransfers.css';
import { ColonyFundsClaim } from '~gql';

const displayName = 'common.UnclaimedTransfers';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Incoming funds for {colony}',
  },
  loadingData: {
    id: `${displayName}.loadingData`,
    defaultMessage: 'Loading token transfers...',
  },
});

const UnclaimedTransfers = () => {
  const { colony } = useColonyContext();
  const { profile, fundsClaims, chainFundsClaim, tokens } = colony || {};
  const { items: claims = [] } = fundsClaims || {};

  /*
   * @NOTE We have to do some very heavy lifting (more or less) here due to us
   * not being able to use Apollo's cache, so we want to short-circuit early
   * in order to not waste any computing resources unecesarily
   */
  if (!chainFundsClaim && !fundsClaims) {
    return null;
  }

  const chainClaimWithToken = chainFundsClaim
    ? {
        ...chainFundsClaim,
        token: tokens?.items?.find(
          (token) => token?.token?.tokenAddress === ADDRESS_ZERO,
        )?.token,
      }
    : null;

  /*
   * Claims data needs to be merged, both ERC20's and Native Chain Tokens
   *
   * Also, we have to sort in-client since Apollo's cache is being a bitch
   * not allowing more than 3 local field entries without breaking, forcing us
   * to do the sorting / merging here, rather than at the time we fetch data.
   * This kinda sucks!
   */
  const sortedFundsClaims = [...claims, chainClaimWithToken]
    .filter((claim) => !!claim)
    .sort(
      (first, second) =>
        (second?.createdAtBlock || 0) - (first?.createdAtBlock || 0),
    );

  return (
    <div className={styles.main}>
      <div className={styles.title}>
        <FormattedMessage
          {...MSG.title}
          values={{
            colony: profile?.displayName || 'colony',
          }}
        />
      </div>
      <ul>
        {sortedFundsClaims.map((claim) => (
          <UnclaimedTransfersItem
            claim={claim as unknown as ColonyFundsClaim}
            key={claim?.id}
          />
        ))}
      </ul>
    </div>
  );
};

UnclaimedTransfers.displayName = displayName;

export default UnclaimedTransfers;
