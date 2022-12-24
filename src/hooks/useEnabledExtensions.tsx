import { Extension } from '@colony/colony-js';

import useExtensionsData from './useExtensionsData';

const useEnabledExtensions = () => {
  const { installedExtensionsData, loading } = useExtensionsData();

  const oneTxPaymentData = installedExtensionsData.find(
    (extensionData) => extensionData.extensionId === Extension.OneTxPayment,
  );
  const isOneTxPaymentEnabled = !!oneTxPaymentData?.isEnabled;

  const votingReputationData = installedExtensionsData.find(
    (extensionData) => extensionData.extensionId === Extension.VotingReputation,
  );
  const isVotingReputationEnabled = !!votingReputationData?.isEnabled;

  return {
    loading,
    isOneTxPaymentEnabled,
    isVotingReputationEnabled,
  };
};

export default useEnabledExtensions;
