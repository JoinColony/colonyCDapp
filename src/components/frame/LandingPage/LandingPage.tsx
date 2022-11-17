import React, { useEffect } from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';

import NavLink from '~shared/NavLink';
import Icon from '~shared/Icon';
import Heading from '~shared/Heading';
import { SpinnerLoader } from '~shared/Preloaders';
import ColonyAvatar from '~shared/ColonyAvatar';

import { CREATE_COLONY_ROUTE, CREATE_USER_ROUTE } from '~routes';
import { useGetMetacolonyQuery } from '~gql';
import { useAppContext, useCanInteractWithNetwork, useUserAccountRegistered } from '~hooks';


import styles from './LandingPage.css';

const displayName = 'frame.LandingPage';

const MSG = defineMessages({
  callToAction: {
    id: `${displayName}.callToAction`,
    defaultMessage: 'Welcome, what would you like to do?',
  },
  createColony: {
    id: `${displayName}.createColony`,
    defaultMessage: 'Create a colony',
  },
  exploreColony: {
    id: `${displayName}.exploreColony`,
    defaultMessage: 'Explore the {colonyName}',
  },
  createUsername: {
    id: `${displayName}.createUsername`,
    defaultMessage: 'Create a username',
  },
});

interface LandingItemProps {
  to: string;
  message: MessageDescriptor;
}
const LandingItem = ({ to, message }: LandingItemProps) => (
  <li className={styles.item}>
    <NavLink to={to} className={styles.itemLink}>
      <Icon className={styles.itemIcon} name="circle-plus" title={message} />
      <span className={styles.itemTitle}>
        <FormattedMessage {...message} />
      </span>
    </NavLink>
  </li>
);

const LandingPage = () => {
  /*
   * Are the network contract deployed to the chain the user is connected
   * so that they can create a new colony on it
   */
  const { wallet, updateUser } = useAppContext();
  const canInteractWithNetwork = useCanInteractWithNetwork();
  const { data, loading } = useGetMetacolonyQuery();
  const userAccountRegistered = useUserAccountRegistered();

  const [metacolony] = data?.getColonyByType?.items || [];

  /* Ensures username is up-to-date post create user flow. */
  useEffect(() => {
    if (updateUser) {
      updateUser(wallet?.address);
    }
  }, [wallet, updateUser]);
  return (
    <div className={styles.main}>
      <div>
        <div className={styles.title}>
          <Heading
            text={MSG.callToAction}
            appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
          />
        </div>
        <ul>
          {/* Resolve flicker when logging in a wallet with an account */}
          {wallet && !userAccountRegistered && (
            <LandingItem to={CREATE_USER_ROUTE} message={MSG.createUsername} />
          )}
          {canInteractWithNetwork && (
            <LandingItem to={CREATE_COLONY_ROUTE} message={MSG.createColony} />
          )}
          {loading && (
            <li className={styles.itemLoading}>
              <SpinnerLoader appearance={{ size: 'medium' }} />
            </li>
          )}
          {metacolony && (
            <li className={styles.item}>
              <NavLink
                to={`/colony/${metacolony.name}`}
                className={styles.itemLink}
              >
                <ColonyAvatar
                  className={styles.itemIcon}
                  colonyAddress={metacolony.colonyAddress}
                  colony={metacolony}
                  size="xl"
                />
                <span className={styles.itemTitle}>
                  <FormattedMessage
                    {...MSG.exploreColony}
                    values={{
                      colonyName:
                        metacolony?.profile?.displayName || metacolony.name,
                    }}
                  />
                </span>
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

LandingPage.displayName = displayName;

export default LandingPage;
