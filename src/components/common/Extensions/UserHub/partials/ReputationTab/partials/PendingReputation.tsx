import React from 'react';
import { useIntl } from 'react-intl';

import styles from '../ReputationTab.module.css';
import TitleLabel from '~shared/Extensions/TitleLabel';

const displayName =
  'common.Extensions.UserHub.partials.ReputationTab.partials.PendingReputation';

const PendingReputation = () => {
  const { formatMessage } = useIntl();

  return (
    <div className="pt-6">
      <TitleLabel text={formatMessage({ id: 'pending.reputation' })} />

      <div className="flex flex-col gap-4 pt-2 pb-6">
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
