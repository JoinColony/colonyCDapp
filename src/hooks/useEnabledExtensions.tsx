import { Extension } from '@colony/colony-js';

import { Colony } from '~types';

import useExtensionsData from './useExtensionsData';

const useEnabledExtensions = (colony: Colony | undefined) => {
  const { installedExtensionsData, loading } = useExtensionsData(colony);

  const oneTxPaymentExtension = installedExtensionsData.find(
    (extension) => extension.extensionId === Extension.OneTxPayment,
  );
  const votingReputationExtension = installedExtensionsData.find(
    (extension) => extension.extensionId === Extension.VotingReputation,
  );

  return {
    loading,
    isOneTxPaymentEnabled: !!oneTxPaymentExtension?.isEnabled,
    isVotingReputationEnabled: !!votingReputationExtension?.isEnabled,
    votingReputationVersion: votingReputationExtension?.currentVersion,
  };
};

export default useEnabledExtensions;
