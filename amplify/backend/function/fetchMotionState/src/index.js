const { MotionState } = require('@colony/colony-js');
const {
  getLatestMotionState,
  updateStakerRewardsInDB,
  getMotionData,
  didMotionPass,
  updateMotionMessagesInDB,
} = require('./utils');
/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  const { colonyAddress, transactionHash } = event.arguments?.input || {};
  /* Get latest motion state from chain */
  const motionData = await getMotionData(transactionHash);
  const motionState = await getLatestMotionState(colonyAddress, motionData);
  /*
   * Check if we need to update staker rewards
   * This ensures the rewards are present in the event a motion fails before going to a vote,
   * so the side that has objected can reclaim their stake.
   */
  if (transactionHash && motionState === MotionState.Failed) {
    if (motionData) {
      const {
        motionStakes: {
          percentage: { yay: yayPercent },
        },
      } = motionData;

      // Motion did not go to a vote
      if (yayPercent !== '100') {
        await updateStakerRewardsInDB(
          colonyAddress,
          transactionHash,
          motionData,
        );
      }
    }
  }

  if (motionState === MotionState.Reveal) {
    if (motionData) {
      console.log('======================motionData:Reveal: ', motionData);
      updateMotionMessagesInDB(
        transactionHash,
        motionData,
        'MotionRevealPhase',
      );
    }
  }

  if (motionState === MotionState.Finalizable) {
    if (motionData) {
      console.log('======================motionData:Finalizable: ', motionData);
      if (didMotionPass(motionData)) {
        updateMotionMessagesInDB(
          transactionHash,
          motionData,
          'MotionHasPassed',
        );
      } else {
        updateMotionMessagesInDB(
          transactionHash,
          motionData,
          'MotionHasFailedNotFinalizable',
        );
      }
    }
  }

  return motionState;
};
