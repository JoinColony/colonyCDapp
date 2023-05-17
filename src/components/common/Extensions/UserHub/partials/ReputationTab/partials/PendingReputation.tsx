import React from 'react';
import { useIntl } from 'react-intl';
import styles from '../ReputationTab.module.css';

const displayName = 'common.Extensions.UserHub.partials.ReputationTab.partials.PendingReputation';

const PendingReputation = () => {
  const { formatMessage } = useIntl();

  return (
    <div className="pt-6">
      <div className="flex flex-row items-center">
        <div className="text-gray-400 text-xs font-medium uppercase">{formatMessage({ id: 'pending.reputation' })}</div>
      </div>

      <div className="flex flex-col gap-[1.3125rem] pt-2 pb-[1.625rem]s">
        <div className={styles.row}>
          <div className={styles.rowName}>{formatMessage({ id: 'next.update' })}</div>
          {/* @TODO: implement data from API */}
          <span className="text-gray-900 font-medium text-sm">~14 mins</span>
        </div>
      </div>
    </div>
  );
};

PendingReputation.displayName = displayName;

export default PendingReputation;
