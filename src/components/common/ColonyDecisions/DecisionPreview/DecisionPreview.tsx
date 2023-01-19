import React, { useEffect, useMemo, useState } from 'react';
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

  // Referential equality needed here to avoid infinite loop in effect.
  const decision = useMemo(
    () => getDecisionFromLocalStorage(walletAddress),
    [walletAddress],
  );

  const [decisionPreview, setDecisionPreview] = useState(decision);

  useEffect(() => {
    // Sync component state with local storage
    setDecisionPreview(decision);
  }, [decision]);

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
      <DecisionData
        decision={decisionPreview}
        setDecision={setDecisionPreview}
        user={user}
      />
      <div className={styles.rightContent}>
        <DecisionPreviewControls
          decision={decisionPreview}
          setDecision={setDecisionPreview}
        />
        {decisionPreview && <DecisionDetails decision={decisionPreview} />}
      </div>
    </DecisionPreviewLayout>
  );
};

DecisionPreview.displayName = displayName;

export default DecisionPreview;
