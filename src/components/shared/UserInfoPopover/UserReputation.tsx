import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import isEmpty from 'lodash/isEmpty';

import Heading from '~shared/Heading';
import { SpinnerLoader } from '~shared/Preloaders';
import { UserDomainReputation } from '~hooks';
import { Colony } from '~types';

import UserReputationItem from './UserReputationItem';

import styles from './UserInfoPopover.css';

const displayName = `UserInfoPopover.UserReputation`;

interface Props {
  colony: Colony;
  userReputationForTopDomains: UserDomainReputation[];
  isCurrentUserReputation: boolean;
  isUserReputationLoading?: boolean;
}

const MSG = defineMessages({
  labelText: {
    id: `${displayName}.labelText`,
    defaultMessage: 'Reputation',
  },
  noReputationDescription: {
    id: `${displayName}.noReputationDescription`,
    defaultMessage: `{isCurrentUserReputation, select,
      true {You don’t have any reputation yet.\nTo earn reputation you}
      other {This user doesn’t have any reputation yet.
            To earn reputation they}
    } need to contribute to the colony`,
  },
  starReputationTitle: {
    id: `${displayName}.starReputationTitle`,
    defaultMessage: `User reputation on {domainName}: {reputation}%`,
  },
});

const UserReputation = ({
  colony,
  userReputationForTopDomains,
  isCurrentUserReputation,
  isUserReputationLoading = false,
}: Props) => {
  const formattedUserReputations = userReputationForTopDomains?.map(
    ({ domainId, ...rest }) => {
      const reputationDomain = colony?.domains?.items.find(
        (domain) => domain?.nativeId === domainId,
      );
      return {
        ...rest,
        reputationDomain,
      };
    },
  );

  return (
    <div className={styles.sectionContainer}>
      <Heading
        appearance={{
          size: 'normal',
          theme: 'grey',
          weight: 'bold',
        }}
        text={MSG.labelText}
      />
      {isUserReputationLoading ? (
        <SpinnerLoader
          appearance={{
            theme: 'grey',
            size: 'small',
          }}
        />
      ) : (
        <>
          {isEmpty(formattedUserReputations) ? (
            <p className={styles.noReputationDescription}>
              <FormattedMessage
                {...MSG.noReputationDescription}
                values={{ isCurrentUserReputation }}
              />
            </p>
          ) : (
            <ul>
              {formattedUserReputations.map(
                ({ reputationDomain, reputationPercentage }) => (
                  <UserReputationItem
                    key={`${reputationDomain?.id}-${reputationPercentage}`}
                    domainName={reputationDomain?.name || ''}
                    reputationPercentage={reputationPercentage}
                  />
                ),
              )}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

UserReputation.displayName = displayName;

export default UserReputation;
