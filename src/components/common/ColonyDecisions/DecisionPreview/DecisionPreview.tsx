import React from 'react';
import { defineMessages } from 'react-intl';
import { useSelector } from 'react-redux';

import LoadingTemplate from '~frame/LoadingTemplate';
import { useAppContext, useColonyContext } from '~hooks';
import Tag from '~shared/Tag';
import { getDraftDecisionFromStore } from '~utils/decisions';

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
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const draftDecision = useSelector(
    getDraftDecisionFromStore(user?.walletAddress || '', colonyAddress),
  );

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
      <DecisionData draftDecision={draftDecision} />
      <div className={styles.rightContent}>
        <DecisionPreviewControls draftDecision={draftDecision} />
        {draftDecision && <DecisionDetails draftDecision={draftDecision} />}
      </div>
    </DecisionPreviewLayout>
  );
};

DecisionPreview.displayName = displayName;

export default DecisionPreview;
