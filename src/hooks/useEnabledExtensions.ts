import { Extension } from '@colony/colony-js';

import { type InstalledExtensionData } from '~types/extensions.ts';
import { type Address } from '~types/index.ts';

import useExtensionsData from './useExtensionsData.ts';

export interface EnabledExtensionData {
  loading: boolean;
  isOneTxPaymentEnabled: boolean;
  isVotingReputationEnabled: boolean;
  votingReputationVersion: number | undefined;
  votingReputationAddress: Address | undefined;
  votingReputationExtensionData: InstalledExtensionData | undefined;
  isStakedExpenditureEnabled: boolean;
  isStagedExpenditureEnabled: boolean;
  stagedExpenditureAddress: Address | undefined;
  isStreamingPaymentsEnabled: boolean;
  isMultiSigEnabled: boolean;
  multiSigExtensionData: InstalledExtensionData | undefined;
  isStagedExtensionInstalled: boolean;
}

const useEnabledExtensions = (): EnabledExtensionData => {
  const { installedExtensionsData, loading } = useExtensionsData();

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
  const multiSigExtension = installedExtensionsData.find(
    (extension) => extension.extensionId === Extension.MultisigPermissions,
  );

  return {
    loading,
    isOneTxPaymentEnabled: !!oneTxPaymentExtension?.isEnabled,
    isVotingReputationEnabled: !!votingReputationExtension?.isEnabled,
    votingReputationVersion: votingReputationExtension?.currentVersion,
    votingReputationAddress: votingReputationExtension?.address,
    votingReputationExtensionData: votingReputationExtension,
    isStakedExpenditureEnabled: !!stakedExpenditureExtension?.isEnabled,
    isStagedExpenditureEnabled: !!stagedExpenditureExtension?.isEnabled,
    stagedExpenditureAddress: stagedExpenditureExtension?.address,
    isStreamingPaymentsEnabled: !!streamingPaymentsExtension?.isEnabled,
    isMultiSigEnabled: !!multiSigExtension?.isEnabled,
    multiSigExtensionData: multiSigExtension,
    isStagedExtensionInstalled: !!stagedExpenditureExtension,
  };
};

export default useEnabledExtensions;
