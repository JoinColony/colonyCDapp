import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useColonyTransfersQuery, Colony, useTokenQuery } from '~data/index';

import { ActionButton } from '~shared/Button';
import Heading from '~shared/Heading';
import NavLink from '~shared/NavLink';
import Numeral from '~shared/Numeral';
import { Tooltip } from '~shared/Popover';
import Link from '~shared/Link';

import { ActionTypes } from '~redux';
import { useCanInteractWithColony } from '~hooks';
import { mergePayload } from '~utils/actions';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import styles from './ColonyUnclaimedTransfers.css';

const displayName = 'dashboard.ColonyHome.ColonyUnclaimedTransfers';

interface Props {
  colony: Colony;
}

const MSG = defineMessages({
  title: {
    id: 'dashboard.ColonyHome.ColonyUnclaimedTransfers.title',
    defaultMessage: 'Incoming funds',
  },
  claimButton: {
    id: 'dashboard.ColonyHome.ColonyUnclaimedTransfers.claimButton',
    defaultMessage: 'Claim',
  },
  tooltip: {
    id: 'dashboard.ColonyHome.ColonyUnclaimedTransfers.tooltip',
    defaultMessage: 'Click to claim incoming funds for this colony.',
  },
  more: {
    id: 'dashboard.ColonyHome.ColonyUnclaimedTransfers.more',
    defaultMessage: '+ {extraClaims} more',
  },
  unknownToken: {
    id: 'dashboard.ColonyHome.ColonyUnclaimedTransfers.unknownToken',
    defaultMessage: 'Unknown Token',
  },
});

const ColonyUnclaimedTransfers = ({
  colony,
  colony: { colonyAddress, colonyName },
}: Props) => {
  const { data, error } = useColonyTransfersQuery({
    variables: { address: colony.colonyAddress },
  });
  const canInteractWithCurrentColony = useCanInteractWithColony(colony);

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
        <NavLink to={`/colony/${colonyName}/funds`}>
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
              disabled={!canInteractWithCurrentColony}
            />
          </Tooltip>
        </li>
        {claimsLength > 1 && (
          <li>
            <Link
              className={styles.manageFundsLink}
              to={`/colony/${colonyName}/funds`}
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
