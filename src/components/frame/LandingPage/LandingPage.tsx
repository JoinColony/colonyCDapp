import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import NavLink from '~shared/NavLink';
import Icon from '~shared/Icon';
import Heading from '~shared/Heading';
import { SpinnerLoader } from '~shared/Preloaders';
import ColonyAvatar from '~shared/ColonyAvatar';

import { CREATE_COLONY_ROUTE } from '~routes';
import { useGetMetacolonyQuery } from '~gql';
import { useCanInteractWithNetwork } from '~hooks';

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
});

const LandingPage = () => {
  /*
   * Are the network contract deployed to the chain the user is connected
   * so that they can create a new colony on it
   */
  const canInteractWithNetwork = useCanInteractWithNetwork();
  const { data, loading } = useGetMetacolonyQuery();

  const [metacolony] = data?.getColonyByType?.items || [];

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
          {canInteractWithNetwork && (
            <li className={styles.item}>
              <NavLink to={CREATE_COLONY_ROUTE} className={styles.itemLink}>
                <Icon
                  className={styles.itemIcon}
                  name="circle-plus"
                  title={MSG.createColony}
                />
                <span className={styles.itemTitle}>
                  <FormattedMessage {...MSG.createColony} />
                </span>
              </NavLink>
            </li>
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
