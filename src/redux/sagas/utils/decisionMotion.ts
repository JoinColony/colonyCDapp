export const getColonyDecisionId = (colonyAddress: string, txHash: string) =>
  `${colonyAddress}_decision_${txHash}`;
