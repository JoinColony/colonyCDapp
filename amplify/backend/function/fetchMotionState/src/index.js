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

  if (transactionHash && motionData) {
    const { motionStateHistory } = motionData;
    const motionState = await getLatestMotionState(colonyAddress, motionData);
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

      // Motion did not go to a vote
      if (yayPercent !== '100') {
        await updateStakerRewardsInDB(
          colonyAddress,
          transactionHash,
          motionData,
        );
      }

      if (!motionStateHistory.hasFailedNotFinalizable) {
        await updateMotionMessagesInDB(
          transactionHash,
          motionData,
          ['MotionHasFailedNotFinalizable'],
          'hasFailedNotFinalizable',
        );
      }
    }

    const didPass = didMotionPass(motionData);

    if (
      motionState === MotionState.Reveal &&
      !motionStateHistory.inRevealPhase
    ) {
      await updateMotionMessagesInDB(
        transactionHash,
        motionData,
        ['MotionRevealPhase'],
        'inRevealPhase',
      );
    }

    if (
      motionState === MotionState.Finalizable ||
      motionState === MotionState.Finalized
    ) {
      // Check if the motion passed and the messages have not already been stored in the db
      if (didPass && !motionStateHistory.hasPassed) {
        const newMessages = [];

        // only display voting results if a vote has occurred
        if (motionStateHistory.hasVoted) {
          newMessages.push('MotionRevealResultMotionWon');
        }
        newMessages.push('MotionHasPassed');

        await updateMotionMessagesInDB(
          transactionHash,
          motionData,
          newMessages,
          'hasPassed',
        );
      }

      if (!didPass && !motionStateHistory.hasFailed) {
        const newMessages = [];

        // only display voting results if a vote has occurred
        if (motionStateHistory.hasVoted) {
          newMessages.push('MotionRevealResultObjectionWon');
        }
        newMessages.push('MotionHasFailedFinalizable');

        await updateMotionMessagesInDB(
          transactionHash,
          motionData,
          newMessages,
          'hasFailed',
        );
      }
    }

    return motionState;
  }

  return undefined;
};
