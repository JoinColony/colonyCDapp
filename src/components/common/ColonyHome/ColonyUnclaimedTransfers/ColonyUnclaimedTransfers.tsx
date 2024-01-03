import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useColonyContext, useColonyFundsClaims } from '~hooks';
import { ActionTypes } from '~redux';
import { COLONY_INCOMING_ROUTE } from '~routes';
import { ActionButton } from '~shared/Button';
import Heading from '~shared/Heading';
import Link from '~shared/Link';
import NavLink from '~shared/NavLink';
import Numeral from '~shared/Numeral';
import { Tooltip } from '~shared/Popover';
import { mergePayload } from '~utils/actions';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

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
  const {
    colony,
    canInteractWithColony,
    startPolling: startPollingColony,
    stopPolling: stopPollingColony,
  } = useColonyContext();
  const claims = useColonyFundsClaims();

  const firstItem = claims[0];

  const transform = mergePayload({
    colonyAddress: colony?.colonyAddress,
    tokenAddresses: [firstItem?.token?.tokenAddress],
  });

  const claimsLength = claims?.length;
  const extraClaims = (claimsLength || 0) - 1;

  /*
   * Token of the first claim (to be displayed)
   */
  const token = firstItem?.token;

  const handleClaimSuccess = () => {
    startPollingColony(1_000);
    setTimeout(stopPollingColony, 10_000);
  };

  return claimsLength ? (
    <div className={styles.main}>
      <Heading appearance={{ size: 'normal', weight: 'bold' }}>
        <NavLink to={`/${colony?.name}/${COLONY_INCOMING_ROUTE}`}>
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
              actionType={ActionTypes.CLAIM_TOKEN}
              onSuccess={handleClaimSuccess}
              transform={transform}
              disabled={!canInteractWithColony}
            />
          </Tooltip>
        </li>
        {claimsLength > 1 && (
          <li>
            <Link
              className={styles.manageFundsLink}
              to={`/${colony?.name}/${COLONY_INCOMING_ROUTE}`}
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
