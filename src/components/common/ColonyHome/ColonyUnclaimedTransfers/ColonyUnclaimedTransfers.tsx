import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useColonyTransfersQuery, useTokenQuery } from '~data/index';

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
  const { colony } = useColonyContext();
  const { colonyAddress, name } = colony || {};

  const { data, error } = useColonyTransfersQuery({
    variables: { address: colonyAddress },
  });
  const { canInteractWithColony } = useColonyContext();

  const firstItem = data?.processedColony.unclaimedTransfers[0];

  const { data: tokenData } = useTokenQuery({
    variables: { address: firstItem?.token || '' },
  });

  const transform = useCallback(
    mergePayload({ colonyAddress, tokenAddress: firstItem?.token || '' }),
    [colonyAddress, firstItem],
  );

  const claimsLength = data?.processedColony?.unclaimedTransfers?.length;
  const extraClaims = (claimsLength || 0) - 1;

  // if (error) console.warn(error);

  const token = tokenData?.token;

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
                unit={getTokenDecimalsWithFallback(token?.decimals)}
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
