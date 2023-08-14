import { Extension } from '@colony/colony-js';

import useExtensionsData from './useExtensionsData';

export interface EnabledExtensionData {
  loading: boolean;
  isOneTxPaymentEnabled: boolean;
  isVotingReputationEnabled: boolean;
  votingReputationVersion: number | undefined;
  shortPollExtensions: () => void;
  isStakedExpenditureEnabled: boolean;
}

const useEnabledExtensions = (): EnabledExtensionData => {
  const { installedExtensionsData, loading, shortPollExtensions } =
    useExtensionsData();

  const oneTxPaymentExtension = installedExtensionsData.find(
    (extension) => extension.extensionId === Extension.OneTxPayment,
  );
  const votingReputationExtension = installedExtensionsData.find(
    (extension) => extension.extensionId === Extension.VotingReputation,
  );
  const stakedExpenditureExtension = installedExtensionsData.find(
    (extension) => extension.extensionId === Extension.StakedExpenditure,
  );

  return {
    loading,
    isOneTxPaymentEnabled: !!oneTxPaymentExtension?.isEnabled,
    isVotingReputationEnabled: !!votingReputationExtension?.isEnabled,
    votingReputationVersion: votingReputationExtension?.currentVersion,
    isStakedExpenditureEnabled: !!stakedExpenditureExtension?.isEnabled,
    shortPollExtensions,
  };
};

export default useEnabledExtensions;
