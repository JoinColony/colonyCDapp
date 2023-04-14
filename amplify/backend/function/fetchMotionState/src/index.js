const { MotionState } = require('@colony/colony-js');
const {
  getLatestMotionState,
  updateStakerRewardsInDB,
  getMotionData,
} = require('./utils');

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  const { motionId, colonyAddress, transactionHash } =
    event.arguments?.input || {};
  /* Get latest motion state from chain */
  const motionState = await getLatestMotionState(colonyAddress, motionId);
  /*
   * Check if we need to update staker rewards
   * This ensures the rewards are present in the event a motion fails before going to a vote,
   * so the side that has objected can reclaim their stake.
   */
  if (transactionHash && motionState === MotionState.Failed) {
    const motionData = await getMotionData(transactionHash);
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

  return motionState;
};
