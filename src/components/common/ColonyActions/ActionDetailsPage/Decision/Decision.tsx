import React from 'react';
import parse from 'html-react-parser';

import { useGetUserByAddressQuery } from '~gql';
import UserAvatar from '~shared/UserAvatar/UserAvatar';
import { ColonyDecision } from '~types';
import styles from './Decision.css';
import TimeRelative from '~shared/TimeRelative/TimeRelative';
import { Heading3 } from '~shared/Heading';

interface DecisionProps {
  decisionData: ColonyDecision;
}

const Decision = ({
  decisionData: { walletAddress, createdAt, title, description },
}: DecisionProps) => {
  const { data } = useGetUserByAddressQuery({
    variables: { address: walletAddress || '' },
  });
  const user = data?.getUserByAddress?.items[0];
  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <UserAvatar
          size="s"
          notSet={false}
          user={user}
          address={walletAddress || ''}
          showInfo
          popperOptions={{
            showArrow: false,
            placement: 'left',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 10],
                },
              },
            ],
          }}
        />
        <div className={styles.nameAndTime}>
          <span className={styles.userName}>{`@${user?.name}`}</span>
          <span className={styles.time}>
            <TimeRelative value={new Date(createdAt)} />
          </span>
        </div>
      </div>
      <div className={styles.title}>
        <Heading3
          appearance={{
            margin: 'small',
            theme: 'dark',
          }}
          text={title}
        />
      </div>
      <div className={styles.description}>{parse(description)}</div>
    </div>
  );
};

export default Decision;
