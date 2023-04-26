import React from 'react';
import { MotionState } from '@colony/colony-js';

import DetailsWidget from '~shared/DetailsWidget';

import { useColonyContext, useEnabledExtensions } from '~hooks';
import { ColonyAction } from '~types';
import { motionStateMap } from '~utils/colonyMotions';
import { STAKING_THRESHOLD } from '~constants';

import { DefaultActionContent } from '../DefaultAction';
import MotionHeading from './MotionHeading';
import MotionPhaseWidget from './MotionPhaseWidget';
import StakeRequiredBanner from './StakeRequiredBanner';

import styles from './DefaultMotion.css';

const displayName = 'common.ColonyActions.ActionDetailsPage.DefaultMotion';

interface DefaultMotionProps {
  actionData: ColonyAction;
}

const DefaultMotion = ({ actionData }: DefaultMotionProps) => {
  const { colony } = useColonyContext();

  const { isVotingReputationEnabled } = useEnabledExtensions();

  if (!colony || !actionData.motionData) {
    return null;
  }

  const motionState = MotionState.Staking;
  const {
    motionData: {
      motionStakes: { percentage: percentageStaked },
    },
  } = actionData;
  const isUnderThreshold =
    Number(percentageStaked.nay) + Number(percentageStaked.yay) <
    STAKING_THRESHOLD;

  return (
    <div className={styles.main}>
      {/* {isMobile && <ColonyHomeInfo showNavigation isMobile />} */}
      {isUnderThreshold && <StakeRequiredBanner isDecision={false} />}
      {isVotingReputationEnabled && (
        <MotionHeading motionState={motionStateMap[motionState]} />
      )}
      <div className={styles.container}>
        <DefaultActionContent actionData={actionData} />
        <div className={styles.widgets}>
          <MotionPhaseWidget
            actionData={actionData}
            motionState={motionState}
          />
          {/* <div className={styles.details}>
        {motionState === MotionState.Voting && (
          <VoteWidget
            colony={colony}
            actionType={actionType}
            motionId={motionId}
            motionDomain={motionDomain}
            scrollToRef={bottomElementRef}
            motionState={motionState}
          />
        )}
        {motionState === MotionState.Reveal && (
          <RevealWidget
            colony={colony}
            motionId={motionId}
            scrollToRef={bottomElementRef}
            motionState={motionState}
          />
        )}
        {(isMotionFinished || motionState === MotionState.Escalation) && (
          <FinalizeMotionAndClaimWidget
            colony={colony}
            actionType={actionType}
            motionId={motionId}
            scrollToRef={bottomElementRef}
            motionState={motionState as MotionState}
            fromDomain={fromDomain}
            motionAmount={amount}
            tokenAddress={tokenAddress}
            isDecision={isDecision}
          />
        )} */}
          <DetailsWidget actionData={actionData} colony={colony} />
        </div>
      </div>
    </div>
  );
};

DefaultMotion.displayName = displayName;

export default DefaultMotion;
