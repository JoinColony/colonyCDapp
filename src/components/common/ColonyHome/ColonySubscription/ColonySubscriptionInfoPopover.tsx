import React, { ReactNode } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Popover from '~shared/Popover';
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
  onUnsubscribe?: () => void;
  children?: ReactNode;
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
      placement="right"
      popperOptions={{
        modifiers: [
          {
            name: 'offset',
            options: {
              /*
               * @NOTE Values are set manual, exactly as the ones provided in the figma spec.
               *
               * There's no logic to how they are calculated, so next time you need
               * to change them you'll either have to go by exact specs, or change
               * them until it "feels right" :)
               */
              offset: [100, -10],
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
