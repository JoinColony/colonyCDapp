import { Extension } from '@colony/colony-js';

import useExtensionsData from './useExtensionsData';

export interface EnabledExtensionData {
  loading: boolean;
  isOneTxPaymentEnabled: boolean;
  isVotingReputationEnabled: boolean;
  votingReputationVersion: number | undefined;
  shortPollExtensions: () => void;
  isStakedExpenditureEnabled: boolean;
  isStagedExpenditureEnabled: boolean;
  isStreamingPaymentsEnabled: boolean;
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
  const stagedExpenditureExtension = installedExtensionsData.find(
    (extension) => extension.extensionId === Extension.StagedExpenditure,
  );
  const streamingPaymentsExtension = installedExtensionsData.find(
    (extension) => extension.extensionId === Extension.StreamingPayments,
  );

  return {
    loading,
    isOneTxPaymentEnabled: !!oneTxPaymentExtension?.isEnabled,
    isVotingReputationEnabled: !!votingReputationExtension?.isEnabled,
    votingReputationVersion: votingReputationExtension?.currentVersion,
    isStakedExpenditureEnabled: !!stakedExpenditureExtension?.isEnabled,
    isStagedExpenditureEnabled: !!stagedExpenditureExtension?.isEnabled,
    isStreamingPaymentsEnabled: !!streamingPaymentsExtension?.isEnabled,
    shortPollExtensions,
  };
};

export default useEnabledExtensions;
