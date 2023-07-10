import React from 'react';
import { useIntl } from 'react-intl';

import styles from '../ReputationTab.module.css';
import TitleLabel from '~v5/shared/TitleLabel';

const displayName =
  'common.Extensions.UserHub.partials.ReputationTab.partials.PendingReputation';

const PendingReputation = () => {
  const { formatMessage } = useIntl();

  return (
    <div className="pt-6 border-b border-gray-200 pb-6 sm:border-none sm:pb-0">
      <TitleLabel text={formatMessage({ id: 'pending.reputation' })} />
      <div className="flex flex-col gap-4 pt-2">
        <div className={styles.row}>
          <p className={styles.rowName}>
            {formatMessage({ id: 'next.update' })}
          </p>
          {/* @TODO: implement data from API */}
          <span className="text-sm">~14 mins</span>
        </div>
      </div>
    </div>
  );
};

PendingReputation.displayName = displayName;

export default PendingReputation;
