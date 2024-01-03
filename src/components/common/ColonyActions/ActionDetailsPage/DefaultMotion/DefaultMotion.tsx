import { MotionState as NetworkMotionState } from '@colony/colony-js';
import React from 'react';

import { useColonyContext, useEnabledExtensions } from '~hooks';
import DetailsWidget from '~shared/DetailsWidget';
import { MotionAction } from '~types/motions';
import { getMotionState } from '~utils/colonyMotions';

import { DefaultActionContent } from '../DefaultAction';
import { RefetchAction, RefetchMotionState } from '../useGetColonyAction';

import MotionHeading from './MotionHeading';
import MotionPhaseWidget from './MotionPhaseWidget';
import StakeRequiredBanner from './StakeRequiredBanner';

import styles from './DefaultMotion.css';

const displayName = 'common.ColonyActions.ActionDetailsPage.DefaultMotion';

interface DefaultMotionProps {
  actionData: MotionAction;
  networkMotionState: NetworkMotionState;
  refetchMotionState: RefetchMotionState;
  refetchAction: RefetchAction;
  startPollingAction: (pollingInterval: number) => void;
  stopPollingAction: () => void;
}

const DefaultMotion = ({
  actionData,
  networkMotionState,
  refetchMotionState,
  ...rest
}: DefaultMotionProps) => {
  const { colony } = useColonyContext();

  const { isVotingReputationEnabled } = useEnabledExtensions();
  const isDecision = !!actionData.decisionData;

  if (!colony) {
    return null;
  }

  const { motionData, showInActionsList } = actionData;
  const motionState = getMotionState(networkMotionState, motionData);

  return (
    <div className={styles.main}>
      {/* {isMobile && <ColonyHomeInfo showNavigation isMobile />} */}
      {!showInActionsList && <StakeRequiredBanner isDecision={isDecision} />}
      {isVotingReputationEnabled && (
        <MotionHeading
          motionState={motionState}
          refetchMotionState={refetchMotionState}
          motionData={motionData}
        />
      )}
      <div className={styles.container}>
        <DefaultActionContent actionData={actionData} colony={colony} />
        <div className={styles.widgets}>
          <MotionPhaseWidget
            actionData={actionData}
            motionState={motionState}
            {...rest}
          />
          <DetailsWidget actionData={actionData} colony={colony} />
        </div>
      </div>
    </div>
  );
};

DefaultMotion.displayName = displayName;

export default DefaultMotion;
