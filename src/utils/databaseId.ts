import { type ColonyActionFragment } from '~gql';

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

export const getHistoricRolesDatabaseId = ({
  colonyAddress,
  nativeId,
  recipientAddress,
  blockNumber,
  isMultiSig,
}: {
  colonyAddress: string;
  nativeId: number | undefined;
  recipientAddress: string | null | undefined;
  blockNumber: number;
  isMultiSig?: ColonyActionFragment['rolesAreMultiSig'];
}) => {
  return `${colonyAddress}_${nativeId}_${recipientAddress}_${blockNumber}${isMultiSig ? '_multisig' : ''}_roles`;
};

export const getStreamingPaymentDatabaseId = (
  colonyAddress: string,
  nativeStreamingPaymentId: number,
) => {
  return `${colonyAddress}_${nativeStreamingPaymentId}`;
};
