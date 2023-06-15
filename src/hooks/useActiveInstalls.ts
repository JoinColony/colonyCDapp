import { Extension } from '@colony/colony-js';
import useFetchActiveInstallsExtension from './useFetchActiveInstallsExtension';

const useActiveInstalls = (extensionId: string) => {
  const { oneTxPaymentData, votingReputationData } =
    useFetchActiveInstallsExtension();

  const activeInstalls =
    extensionId === Extension.OneTxPayment
      ? oneTxPaymentData
      : votingReputationData;

  return Number(activeInstalls);
};

export default useActiveInstalls;
