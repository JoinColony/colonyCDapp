export const getDomainDatabaseId = (
  colonyAddress: string,
  nativeDomainId: number,
) => {
  return `${colonyAddress}_${nativeDomainId}`;
};

export const getPendingMetadataDatabaseId = (
  colonyAddress: string,
  txHash: string,
) => {
  return `${colonyAddress}_motion-${txHash}`;
};

export const getExpenditureDatabaseId = (
  colonyAddress: string,
  nativeExpenditureId: number,
) => {
  return `${colonyAddress}_${nativeExpenditureId}`;
};
