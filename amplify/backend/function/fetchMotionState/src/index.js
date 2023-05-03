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
  if (motionData) {
    const motionState = await getLatestMotionState(colonyAddress, motionData);
    /*
     * Check if we need to update staker rewards
     * This ensures the rewards are present in the event a motion fails before going to a vote,
     * so the side that has objected can reclaim their stake.
     */
    if (transactionHash && motionState === MotionState.Failed) {
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

    const didPass = didMotionPass(motionData);

    if (
      transactionHash &&
      motionState === MotionState.Reveal &&
      !motionData.inRevealPhase
    ) {
      await updateMotionMessagesInDB(
        transactionHash,
        motionData,
        ['MotionRevealPhase'],
        'inRevealPhase',
      );
    }

    if (
      transactionHash &&
      (motionState === MotionState.Finalizable ||
        motionState === MotionState.Finalized)
    ) {
      if (didPass && !motionData.hasPassed) {
        const newMessages = [];
        newMessages.push('MotionRevealResultMotionWon');
        newMessages.push('MotionHasPassed');
        await updateMotionMessagesInDB(
          transactionHash,
          motionData,
          newMessages,
          'hasPassed',
        );
      }

      if (!didPass && !motionData.hasFailed) {
        const newMessages = [];
        newMessages.push('MotionRevealResultObjectionWon');
        newMessages.push('MotionHasFailedFinalizable');
        await updateMotionMessagesInDB(
          transactionHash,
          motionData,
          newMessages,
          'hasFailed',
        );
      }
    }

    if (transactionHash && motionState === MotionState.Failed) {
      if (!motionData.hasFailedNotFinalizable) {
        await updateMotionMessagesInDB(
          transactionHash,
          motionData,
          ['MotionHasFailedNotFinalizable'],
          'hasFailedNotFinalizable',
        );
      }
    }

    return motionState;
  }

  return undefined;
};
