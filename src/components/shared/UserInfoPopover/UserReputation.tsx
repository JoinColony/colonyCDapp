import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import isEmpty from 'lodash/isEmpty';

import Heading from '~shared/Heading';
import { UserReputationForTopDomainsQuery } from '~data/generated';
import { Colony } from '~types';
import { ZeroValue } from '~utils/reputation';

import styles from './UserInfoPopover.css';
import Icon from '~shared/Icon';
import Numeral from '~shared/Numeral';

const displayName = `UserInfoPopover.UserReputation`;

interface Props {
  colony: Colony;
  // eslint-disable-next-line max-len
  userReputationForTopDomains: UserReputationForTopDomainsQuery['userReputationForTopDomains'];
  isCurrentUserReputation: boolean;
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
}: Props) => {
  const formattedUserReputations = userReputationForTopDomains?.map(
    ({ domainId, ...rest }) => {
      const reputationDomain = colony.domains.find(
        (domain) => domain.ethDomainId === domainId,
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
              <li
                key={`${reputationDomain?.name}-${reputationPercentage}`}
                className={styles.domainReputationItem}
              >
                <p className={styles.domainName}>{reputationDomain?.name}</p>
                <div className={styles.reputationContainer}>
                  {reputationPercentage === ZeroValue.NearZero && (
                    <div className={styles.reputation}>
                      {reputationPercentage}
                    </div>
                  )}
                  {reputationPercentage !== ZeroValue.NearZero && (
                    <Numeral
                      className={styles.reputation}
                      value={reputationPercentage}
                      suffix="%"
                    />
                  )}
                  <Icon
                    name="star"
                    appearance={{ size: 'extraTiny' }}
                    className={styles.icon}
                    title={MSG.starReputationTitle}
                    titleValues={{
                      reputation: reputationPercentage,
                      domainName: reputationDomain?.name,
                    }}
                  />
                </div>
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
};

UserReputation.displayName = displayName;

export default UserReputation;
