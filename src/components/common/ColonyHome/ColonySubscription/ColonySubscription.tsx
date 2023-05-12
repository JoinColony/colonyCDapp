import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button, { ThreeDotsButton } from '~shared/Button';
import MaskedAddress from '~shared/MaskedAddress';
import InvisibleCopyableAddress from '~shared/InvisibleCopyableAddress';
import { useAppContext, useColonyContext } from '~hooks';
import useColonySubscription from '~hooks/useColonySubscription';

import ColonySubscriptionInfoPopover from './ColonySubscriptionInfoPopover';

import styles from './ColonySubscription.css';

const displayName = 'common.ColonyHome.ColonySubscription';

const MSG = defineMessages({
  copyMessage: {
    id: `${displayName}.copyMessage`,
    defaultMessage: 'Click to copy Colony address',
  },
  joinColony: {
    id: `${displayName}.joinColony`,
    defaultMessage: 'Join this Colony',
  },
  colonyMenuTitle: {
    id: `${displayName}.colonyMenuTitle`,
    defaultMessage: 'Colony Menu',
  },
});

const ColonySubscription = () => {
  const { wallet, user, walletConnecting, userLoading } = useAppContext();
  const { colony, canInteractWithColony } = useColonyContext();
  const { canWatch, handleWatch, unwatch } = useColonySubscription();
  const noRegisteredUser = !user && !userLoading;
  const noWalletConnected = !wallet && !walletConnecting;
  const showJoinButton = canWatch || noWalletConnected || noRegisteredUser;

  return (
    <div className={styles.main}>
      <div className={canInteractWithColony ? styles.colonySubscribed : ''}>
        {colony?.colonyAddress && (
          <InvisibleCopyableAddress
            address={colony?.colonyAddress}
            copyMessage={MSG.copyMessage}
          >
            <div className={styles.colonyAddress}>
              <MaskedAddress address={colony?.colonyAddress} />
            </div>
          </InvisibleCopyableAddress>
        )}
        {showJoinButton ? (
          <div className={styles.colonyJoin}>
            <Button
              onClick={handleWatch}
              appearance={{ theme: 'blue', size: 'small' }}
              data-test="joinColonyButton"
              className={styles.colonyJoinBtn}
            >
              <FormattedMessage {...MSG.joinColony} />
            </Button>
          </div>
        ) : (
          <ColonySubscriptionInfoPopover onUnsubscribe={unwatch} canUnsubscribe>
            {({ isOpen, toggle, ref, id }) => (
              <ThreeDotsButton
                id={id}
                innerRef={ref}
                isOpen={isOpen}
                className={styles.menuIconContainer}
                activeStyles={styles.menuActive}
                onClick={toggle}
                tabIndex={0}
                data-test="colonyMenuPopover"
                title={MSG.colonyMenuTitle}
              />
            )}
          </ColonySubscriptionInfoPopover>
        )}
      </div>
    </div>
  );
};

ColonySubscription.displayName = displayName;

export default ColonySubscription;
