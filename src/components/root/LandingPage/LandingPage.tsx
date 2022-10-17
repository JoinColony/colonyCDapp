import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useQuery, gql } from '@apollo/client';

import NavLink from '~shared/NavLink';
// import Icon from '~shared/Icon';
// import HookedColonyAvatar from '~dashboard/HookedColonyAvatar';
// import Heading from '~shared/Heading';
import { SpinnerLoader } from '~shared/Preloaders';
import ColonyAvatar from '~shared/ColonyAvatar';

// import { CREATE_COLONY_ROUTE } from '~routes/index';
// import { useLoggedInUser, useMetaColonyQuery } from '~data/index';
// import { checkIfNetworkIsAllowed } from '~utils/networks';

import { getMetacolony } from '~gql';

import styles from './LandingPage.css';

const displayName = 'root.LandingPage';

const MSG = defineMessages({
  // callToAction: {
  //   id: 'pages.LandingPage.callToAction',
  //   defaultMessage: 'Welcome, what would you like to do?',
  // },
  // wrongNetwork: {
  //   id: 'pages.LandingPage.wrongNetwork',
  //   defaultMessage: `You're connected to the wrong network. Please connect to the appriopriate Ethereum network.`,
  // },
  // createColony: {
  //   id: 'pages.LandingPage.createColony',
  //   defaultMessage: 'Create a colony',
  // },
  exploreColony: {
    id: `${displayName}.exploreColony`,
    defaultMessage: 'Explore the {colonyName}',
  },
});

// const ColonyAvatar = HookedColonyAvatar({ fetchColony: false });

const LandingPage = () => {
  // const { networkId, ethereal } = useLoggedInUser();

  // const { data, loading } = useMetaColonyQuery();

  // const isNetworkAllowed = checkIfNetworkIsAllowed(networkId);

  const { data, loading } = useQuery(gql(getMetacolony));

  const [metacolony] = data?.getColonyByType?.items || [];

  return (
    <div className={styles.main}>
      <div>
        <div className={styles.title}>
          {/* {(ethereal || isNetworkAllowed) && (
            <Heading
              text={MSG.callToAction}
              appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
            />
          )} */}
          {/* {!ethereal && !isNetworkAllowed && (
            <Heading
              text={MSG.wrongNetwork}
              appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
            />
          )} */}
        </div>
        <ul>
          {/* {(ethereal || isNetworkAllowed) && (
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
          )} */}
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
