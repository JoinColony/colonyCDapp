import React from 'react';
import { MotionState as NetworkMotionState } from '@colony/colony-js';

import DetailsWidget from '~shared/DetailsWidget';
import {
  RefetchMotionState,
  useColonyContext,
  useEnabledExtensions,
} from '~hooks';
import { ColonyAction } from '~types';
import { getMotionState } from '~utils/colonyMotions';

import { DefaultActionContent } from '../DefaultAction';
import MotionHeading from './MotionHeading';
import MotionPhaseWidget from './MotionPhaseWidget';
import StakeRequiredBanner from './StakeRequiredBanner';

import styles from './DefaultMotion.css';

const displayName = 'common.ColonyActions.ActionDetailsPage.DefaultMotion';

interface DefaultMotionProps {
  actionData: ColonyAction;
  networkMotionState: NetworkMotionState;
  refetchMotionState: RefetchMotionState;
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

  if (!colony || !actionData.motionData) {
    return null;
  }

  const motionState = getMotionState(networkMotionState, actionData.motionData);

  const { motionData, showInActionsList } = actionData;

  return (
    <div className={styles.main}>
      {/* {isMobile && <ColonyHomeInfo showNavigation isMobile />} */}
      {!showInActionsList && <StakeRequiredBanner isDecision={false} />}
      {isVotingReputationEnabled && (
        <MotionHeading
          motionState={motionState}
          refetchMotionState={refetchMotionState}
          motionData={motionData}
        />
      )}
      <div className={styles.container}>
        <DefaultActionContent actionData={actionData} />
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
