import React from 'react';
import { defineMessages } from 'react-intl';

import Tag from '~shared/Tag';
import { getDecisionFromLocalStorage } from '~utils/decisions';
import LoadingTemplate from '~frame/LoadingTemplate';
import { useAppContext } from '~hooks';

import {
  DecisionData,
  DecisionPreviewControls,
  DecisionDetails,
  DecisionPreviewLayout,
} from '../DecisionPreview';

import styles from './DecisionPreview.css';

const displayName = 'common.ColonyDecisions.DecisionPreview';

const MSG = defineMessages({
  preview: {
    id: `${displayName}.preview`,
    defaultMessage: `Preview`,
  },
  loadingText: {
    id: `${displayName}.loadingText`,
    defaultMessage: 'Loading Decision',
  },
});

const DecisionPreview = () => {
  const { user, walletConnecting, userLoading } = useAppContext();
  const walletAddress = user?.walletAddress || '';

  const decision = getDecisionFromLocalStorage(walletAddress);

  if (walletConnecting || userLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <LoadingTemplate loadingText={MSG.loadingText} />
      </div>
    );
  }

  return (
    <DecisionPreviewLayout>
      <div className={styles.banner}>
        <Tag text={MSG.preview} appearance={{ theme: 'light' }} />
      </div>
      <DecisionData decision={decision} user={user} />
      <div className={styles.rightContent}>
        <DecisionPreviewControls decision={decision} />
        {decision && <DecisionDetails decision={decision} />}
      </div>
    </DecisionPreviewLayout>
  );
};

DecisionPreview.displayName = displayName;

export default DecisionPreview;
