import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ActionButton } from '~shared/Button';
import Heading from '~shared/Heading';
import NavLink from '~shared/NavLink';
import Numeral from '~shared/Numeral';
import { Tooltip } from '~shared/Popover';
import Link from '~shared/Link';
import { ActionTypes } from '~redux';
import { mergePayload } from '~utils/actions';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { useColonyContext } from '~hooks';
import { ADDRESS_ZERO } from '~constants';

import styles from './ColonyUnclaimedTransfers.css';

const displayName = 'common.ColonyHome.ColonyUnclaimedTransfers';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Incoming funds',
  },
  claimButton: {
    id: `${displayName}.claimButton`,
    defaultMessage: 'Claim',
  },
  tooltip: {
    id: `${displayName}.tooltip`,
    defaultMessage: 'Click to claim incoming funds for this colony.',
  },
  more: {
    id: `${displayName}.more`,
    defaultMessage: '+ {extraClaims} more',
  },
  unknownToken: {
    id: `${displayName}.unknownToken`,
    defaultMessage: 'Unknown Token',
  },
});

const ColonyUnclaimedTransfers = () => {
  const { colony, canInteractWithColony } = useColonyContext();
  const { colonyAddress, name, fundsClaims, chainFundsClaim, tokens } =
    colony || {};
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

  const firstItem = sortedFundsClaims[0];

  const transform = mergePayload({
    colonyAddress,
    tokenAddress: firstItem?.token?.tokenAddress || '',
  });

  const claimsLength = sortedFundsClaims?.length;
  const extraClaims = (claimsLength || 0) - 1;

  /*
   * Token of the first claim (to be displayed)
   */
  const token = firstItem?.token;

  return claimsLength ? (
    <div className={styles.main}>
      <Heading appearance={{ size: 'normal', weight: 'bold' }}>
        <NavLink to={`/colony/${name}/funds`}>
          <FormattedMessage {...MSG.title} />
        </NavLink>
      </Heading>
      <ul>
        <li className={styles.firstLineContainer}>
          <div className={styles.tokenItem}>
            <span className={styles.tokenValue}>
              <Numeral
                decimals={getTokenDecimalsWithFallback(token?.decimals)}
                value={firstItem?.amount || ''}
              />
            </span>
            <span className={styles.tokenSymbol}>
              {token?.symbol ? (
                <span>{token?.symbol}</span>
              ) : (
                <FormattedMessage {...MSG.unknownToken} />
              )}
            </span>
          </div>
          <Tooltip
            trigger="hover"
            content={
              <div className={styles.tooltip}>
                <FormattedMessage {...MSG.tooltip} />
              </div>
            }
            placement="top"
            popperOptions={{
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 5],
                  },
                },
              ],
            }}
          >
            <ActionButton
              text={MSG.claimButton}
              className={styles.button}
              submit={ActionTypes.CLAIM_TOKEN}
              error={ActionTypes.CLAIM_TOKEN_ERROR}
              success={ActionTypes.CLAIM_TOKEN_SUCCESS}
              transform={transform}
              disabled={!canInteractWithColony}
            />
          </Tooltip>
        </li>
        {claimsLength > 1 && (
          <li>
            <Link
              className={styles.manageFundsLink}
              to={`/colony/${name}/funds`}
              data-test="manageFunds"
            >
              <div className={styles.tokenItem}>
                <FormattedMessage {...MSG.more} values={{ extraClaims }} />
              </div>
            </Link>
          </li>
        )}
      </ul>
    </div>
  ) : null;
};

ColonyUnclaimedTransfers.displayName = displayName;

export default ColonyUnclaimedTransfers;
