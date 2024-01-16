require('cross-fetch/polyfill');
const { MotionState } = require('@colony/colony-js');
const {
  getLatestMotionState,
  updateStakerRewardsInDB,
  getMotionData,
  updateMotionMessagesInDB,
  setEnvVariables,
  updateMotionFinalizedMessages,
} = require('./utils');
/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  try {
    await setEnvVariables();
    const { colonyAddress, databaseMotionId } = event.arguments?.input || {};
    const motionData = await getMotionData(databaseMotionId);

    if (motionData) {
      const { motionStateHistory, isDecision } = motionData;
      /* Get latest motion state from chain */
      const motionState = await getLatestMotionState(colonyAddress, motionData);

      if (
        isDecision &&
        (motionState === MotionState.Finalized ||
          motionState === MotionState.Failed)
      ) {
        await updateStakerRewardsInDB(colonyAddress, motionData);
        if (motionState === MotionState.Finalized) {
          await updateMotionFinalizedMessages(
            motionData,
            motionStateHistory,
            true,
          );
        } else if (!motionStateHistory.hasFailedNotFinalizable) {
          await updateMotionMessagesInDB(
            motionData,
            ['MotionHasFailedNotFinalizable'],
            'hasFailedNotFinalizable',
          );
        }

        return motionState;
      }
      /*
       * Check if we need to update staker rewards
       * This ensures the rewards are present in the event a motion fails before going to a vote,
       * so the side that has objected can reclaim their stake.
       */
      if (motionState === MotionState.Failed) {
        const {
          motionStakes: {
            percentage: { yay: yayPercent },
          },
        } = motionData;

        // Motion failed without going to a vote
        if (yayPercent !== '100') {
          await updateStakerRewardsInDB(colonyAddress, motionData);
        }

        if (!motionStateHistory.hasFailedNotFinalizable) {
          await updateMotionMessagesInDB(
            motionData,
            ['MotionHasFailedNotFinalizable'],
            'hasFailedNotFinalizable',
          );
        }
      }

      if (
        motionState === MotionState.Reveal &&
        !motionStateHistory.inRevealPhase
      ) {
        await updateMotionMessagesInDB(
          motionData,
          ['MotionRevealPhase'],
          'inRevealPhase',
        );
      }

      if (
        motionState === MotionState.Finalizable ||
        motionState === MotionState.Finalized
      ) {
        if (
          // If the motion is finalizable, and we have voted, we expect the revealed votes to be populated to the db.
          // If they have not yet been added, don't update the messages, else we'll show an incorrect vote outcome.
          motionStateHistory.hasVoted &&
          motionData.revealedVotes.raw.yay === '0' &&
          motionData.revealedVotes.raw.nay === '0'
        ) {
          return motionState;
        }
        await updateMotionFinalizedMessages(motionData, motionStateHistory);
      }

      return motionState;
    }

    return MotionState.Null;
  } catch (e) {
    console.error(e);
    return MotionState.Null;
  }
};
