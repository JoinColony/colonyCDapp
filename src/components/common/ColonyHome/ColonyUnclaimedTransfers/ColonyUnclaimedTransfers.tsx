import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ActionButton } from '~shared/Button';
import Heading from '~shared/Heading';
import NavLink from '~shared/NavLink';
import Numeral from '~shared/Numeral';
import { Tooltip } from '~shared/Popover';
import Link from '~shared/Link';

import { ActionTypes } from '~redux';
import { useColonyContext, useColonyFundsClaims } from '~hooks';
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
  const { colony, canInteractWithColony } = useColonyContext();
  const claims = useColonyFundsClaims();

  const firstItem = claims[0];

  const transform = mergePayload({
    colonyAddress: colony?.colonyAddress,
    tokenAddress: firstItem?.token?.tokenAddress || '',
  });

  const claimsLength = claims?.length;
  const extraClaims = (claimsLength || 0) - 1;

  /*
   * Token of the first claim (to be displayed)
   */
  const token = firstItem?.token;

  return claimsLength ? (
    <div className={styles.main}>
      <Heading appearance={{ size: 'normal', weight: 'bold' }}>
        <NavLink to={`/colony/${colony?.name}/funds`}>
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
              to={`/colony/${colony?.name}/funds`}
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
