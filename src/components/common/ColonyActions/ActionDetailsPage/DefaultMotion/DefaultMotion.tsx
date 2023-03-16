import React from 'react';

import DetailsWidget from '~shared/DetailsWidget';
import LoadingTemplate from '~frame/LoadingTemplate';
import { useDefaultMotion } from '~hooks';

import { DefaultActionContent } from '../DefaultAction';
import MotionHeading from './MotionHeading';
import MotionPhaseWidget from './MotionPhaseWidget';
import StakeRequiredBanner from './StakeRequiredBanner';

import { loadingActionMSG } from '../ActionDetailsPage';

import styles from './DefaultMotion.css';

const displayName = 'common.ColonyActions.ActionDetailsPage.DefaultMotion';

interface DefaultMotionProps {
  motionId: string;
}

const DefaultMotion = ({ motionId }: DefaultMotionProps) => {
  const {
    showBanner,
    setShowBanner,
    showMotionHeading,
    updateMotion,
    updatedMotion,
    motionState,
    setMotionState,
    loadingMotion,
    colony,
  } = useDefaultMotion(motionId);

  const showLoading = loadingMotion || !updatedMotion;

  if (showLoading) {
    return <LoadingTemplate loadingText={loadingActionMSG} />;
  }

  return (
    <div className={styles.main}>
      {/* {isMobile && <ColonyHomeInfo showNavigation isMobile />} */}
      {showBanner && <StakeRequiredBanner isDecision={false} />}
      {showMotionHeading && <MotionHeading motionState={motionState} />}
      <div className={styles.container}>
        <DefaultActionContent actionData={updatedMotion} />
        <div className={styles.widgets}>
          <MotionPhaseWidget
            actionData={updatedMotion}
            motionState={motionState}
            setShowStakeBanner={setShowBanner}
            updateMotion={updateMotion}
            setMotionState={setMotionState}
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
          <DetailsWidget actionData={updatedMotion} colony={colony} />
        </div>
      </div>
    </div>
  );
};

DefaultMotion.displayName = displayName;

export default DefaultMotion;
