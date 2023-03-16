const { MotionState } = require('@colony/colony-js');
const {
  getColonyActionFromDB,
  updateColonyActionInDB,
  pollForColonyAction,
  getLatestMotionState,
} = require('./utils');

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  const { motionId, transactionHash, colonyAddress } =
    event.arguments?.input || {};

  /* Get the motion we're going to update */
  const { data: colonyActionQuery } = await getColonyActionFromDB(
    transactionHash,
  );

  const motionData = colonyActionQuery?.getColonyAction?.motionData;

  /* Get latest motion state from chain */
  const motionState = await getLatestMotionState(colonyAddress, motionId);

  const updatedMotionData = {
    ...motionData,
    motionState,
  };

  /* Call the mutation with the updated motion state */
  const { data: updatedActionData } = await updateColonyActionInDB(
    transactionHash,
    updatedMotionData,
  );

  let updatedMotion = updatedActionData?.updateColonyAction;

  if (!updatedMotion) {
    return null;
  }

  /*
   * We want to return the latest motion data to the caller of this query.
   * The block ingestor populates the stakerRewards field when the motion gets finalized.
   * Here, we poll the db for up to 30 seconds, until this field has been populated.
   */
  if (
    motionState === MotionState.Finalized &&
    !updatedMotion.motionData.stakerRewards.length
  ) {
    updatedMotion = await pollForColonyAction(transactionHash, updatedMotion);
  }

  return updatedMotion;
};
