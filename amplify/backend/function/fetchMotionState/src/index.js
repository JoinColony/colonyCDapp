const { getLatestMotionState } = require('./utils');
/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  const { motionId, colonyAddress } = event.arguments?.input || {};
  /* Get latest motion state from chain */
  const motionState = await getLatestMotionState(colonyAddress, motionId);
  return motionState;
};
