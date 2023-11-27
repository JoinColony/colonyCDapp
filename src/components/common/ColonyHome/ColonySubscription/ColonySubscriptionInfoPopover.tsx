import React, { ReactElement } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Popover, { PopoverChildFn } from '~shared/Popover';
import Button from '~shared/Button';
import MaskedAddress from '~shared/MaskedAddress';
import ColonyAvatar from '~shared/ColonyAvatar';
import { useColonyContext } from '~hooks';

import styles from './ColonySubscriptionInfoPopover.css';

const displayName = 'common.ColonyHome.ColonySubscriptionInfoPopover';

const MSG = defineMessages({
  leaveColonyQuestion: {
    id: `${displayName}.leaveColonyQuestion`,
    defaultMessage: 'Leave?',
  },
  nativeTokenTitle: {
    id: `${displayName}.nativeTokenTitle`,
    defaultMessage: 'Native Token Address',
  },
});

interface Props {
  /** Handle method on unsubscribing */
  onUnsubscribe?: () => void;
  /** Children elements or components to wrap the tooltip around */
  children?: ReactElement | PopoverChildFn;
  /** Passes in the state of the users subscription and if they can unsubscribe */
  canUnsubscribe?: boolean;
}

const ColonySubscriptionInfoPopover = ({
  children,
  canUnsubscribe = true,
  onUnsubscribe = () => {},
}: Props) => {
  const { colony } = useColonyContext();

  if (!colony) {
    return null;
  }

  const { colonyAddress, name, nativeToken, metadata } = colony;
  const { tokenAddress } = nativeToken;

  return (
    <Popover
      renderContent={
        <div className={styles.main}>
          <div className={styles.colonyDetails}>
            <div className={styles.colonyAvatar}>
              <ColonyAvatar
                colonyAddress={colonyAddress}
                colony={colony}
                size="s"
              />
            </div>
            <div className={styles.colonyInfo}>
              <span className={styles.colonyInfoTitle}>
                {metadata?.displayName || name}
              </span>
              <span className={styles.colonyInfoEns}>@{name}</span>
              <span className={styles.colonyInfoAddress}>
                <MaskedAddress address={colonyAddress} full />
              </span>
            </div>
            {canUnsubscribe && (
              <div className={styles.unsubscribeFromColony}>
                <Button
                  appearance={{ theme: 'blue', size: 'small' }}
                  onClick={onUnsubscribe}
                >
                  <FormattedMessage {...MSG.leaveColonyQuestion} />
                </Button>
              </div>
            )}
          </div>
          <span className={styles.nativeTokenTitle}>
            <FormattedMessage {...MSG.nativeTokenTitle} />
          </span>
          <span className={styles.nativeTokenAddress}>
            <MaskedAddress
              address={tokenAddress}
              full
              dataTest="nativeTokenAddress"
            />
          </span>
        </div>
      }
      trigger="click"
      showArrow={false}
      placement="top-start"
      popperOptions={{
        modifiers: [
          {
            name: 'offset',
            options: {
              /*
               * @NOTE Values are set using measurements pulled
               * from the positioning used in the spec.
               */
              offset: [-3, 15],
            },
          },
        ],
      }}
    >
      {children}
    </Popover>
  );
};

ColonySubscriptionInfoPopover.displayName = displayName;

export default ColonySubscriptionInfoPopover;
