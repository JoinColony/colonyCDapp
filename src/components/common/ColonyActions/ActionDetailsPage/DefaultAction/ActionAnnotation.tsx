import React from 'react';
import { useAppContext } from '~hooks';
import UserAvatar from '~shared/UserAvatar/UserAvatar';

import FriendlyName from '~shared/FriendlyName/FriendlyName';
import TransactionMeta from '../TransactionMeta/TransactionMeta';
import { AnnotationType } from '~types';
import { getMainClasses } from '~utils/css';

import styles from './ActionAnnotation.css';

const displayName = 'common.ColonyActions.DefaultAction.Annotation';

interface AnnotationProps {
  annotation: AnnotationType;
  isObjection?: boolean;
}

const Annotation = ({
  annotation: { createdAt, message },
  isObjection = false,
}: AnnotationProps) => {
  const { user } = useAppContext();
  return (
    <div className={getMainClasses({}, styles, { isObjection })}>
      <div className={styles.avatar}>
        <UserAvatar
          size="xs"
          address={user?.walletAddress || ''}
          user={user}
          showInfo
          notSet={false}
          popperOptions={{
            showArrow: false,
            placement: 'bottom-start',
          }}
        />
      </div>
      <div>
        <div className={styles.content}>
          <div className={styles.details}>
            <span className={styles.username}>
              <FriendlyName agent={user} />
            </span>
            <TransactionMeta createdAt={createdAt} />
          </div>
          <div className={styles.text} data-test="comment">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};

Annotation.displayName = displayName;
export default Annotation;
