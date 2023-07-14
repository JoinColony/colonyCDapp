import { SAFE_NETWORKS } from '~constants';

export const getChainNameFromSafe = (safeDisplayName: string) => {
  return safeDisplayName.match(/\(([^()]*)\)$/)?.pop() || '';
};

export const getTxServiceBaseUrl = (selectedChain: string) => {
  const selectedNetwork = SAFE_NETWORKS.find(
    (network) => network.name === selectedChain,
  );

  if (!selectedNetwork || !selectedNetwork.safeTxService) {
    throw new Error(`Selected chain ${selectedChain} not currently supported.`);
  }

  return selectedNetwork.safeTxService;
};
