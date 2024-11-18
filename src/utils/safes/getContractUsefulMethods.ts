import { type JsonFragment } from '@ethersproject/abi';
import { keccak256, toUtf8Bytes } from 'ethers/lib/utils';

import {
  BINANCE_NETWORK,
  GANACHE_NETWORK,
  SUPPORTED_SAFE_NETWORKS,
} from '~constants/index.ts';

export interface AbiItemExtended extends JsonFragment {
  name: string;
  type: 'function';
  action: string;
  methodSignature: string;
  signatureHash: string;
}

const getCurrentNetworkData = (chainId: string) => {
  return SUPPORTED_SAFE_NETWORKS.find((network) => network.chainId === chainId);
};

export const getApiKey = (chainId: string) => {
  if (chainId === BINANCE_NETWORK.chainId) {
    return import.meta.env.BSCSCAN_API_KEY;
  }
  if (chainId === GANACHE_NETWORK.chainId) {
    return import.meta.env.ARBISCAN_API_KEY;
  }
  return import.meta.env.ETHERSCAN_API_KEY;
};

export const fetchContractName = async (
  contractAddress: string,
  safeChainId: string,
): Promise<string> => {
  // will be defined since fetchContractName is only called if selectedSafe is defined

  const currentNetworkData = getCurrentNetworkData(safeChainId)!;

  const apiKey = getApiKey(currentNetworkData.chainId);
  const apiUri =
    `${currentNetworkData.apiUri}` +
    `?apiKey=${apiKey}` +
    `&module=contract` +
    `&action=getsourcecode` +
    `&address=${contractAddress}`;

  try {
    const response = await fetch(apiUri);
    const data = await response.json();
    return data.result[0].ContractName || '';
  } catch (error) {
    console.error('Failed to get contract name', error);
    return '';
  }
};

export const fetchContractABI = async (
  contractAddress: string,
  safeChainId: string,
) => {
  if (!contractAddress) {
    return [];
  }

  try {
    // will be defined since fetchContractABI is only called if selectedSafe is defined

    const currentNetworkData = getCurrentNetworkData(safeChainId)!;

    const apiKey = getApiKey(currentNetworkData.chainId);
    const apiUri =
      `${currentNetworkData.apiUri}` +
      `?apiKey=${apiKey}` +
      `&module=contract` +
      `&action=getabi` +
      `&address=${contractAddress}`;

    const response = await fetch(apiUri);

    if (!response.ok) {
      return [];
    }

    const responseJSON = await response.json();

    return responseJSON;
  } catch (error) {
    console.error('Failed to retrieve ABI', error);
    return '';
  }
};

const extractUsefulMethods = (abi: JsonFragment[]): AbiItemExtended[] => {
  const extendedAbiItems = abi.filter(
    ({ name, type }) => type === 'function' && !!name,
  ) as AbiItemExtended[];
  const getMethodSignatureAndSignatureHash = (
    method: JsonFragment,
  ): { methodSignature: string; signatureHash: string } => {
    const params = method.inputs?.map((x) => x.type).join(',');
    const methodSignature = `${method.name}(${params})`;
    const signatureHash = keccak256(toUtf8Bytes(methodSignature));
    return { methodSignature, signatureHash };
  };
  const getMethodAction = ({
    stateMutability,
  }: JsonFragment): 'read' | 'write' => {
    if (!stateMutability) {
      return 'write';
    }
    return ['view', 'pure'].includes(stateMutability) ? 'read' : 'write';
  };

  return extendedAbiItems
    .map((method) => ({
      ...getMethodSignatureAndSignatureHash(method),
      ...method,
      action: getMethodAction(method),
    }))
    .filter((method) => {
      // @NOTE: We don't have the UI to handle view functions
      return method.action === 'write';
    })
    .sort(({ name: a }, { name: b }) => {
      return a.toLowerCase() > b.toLowerCase() ? 1 : -1;
    });
};

export const isAbiItem = (value: unknown): value is JsonFragment[] => {
  return (
    Array.isArray(value) &&
    value.every((element) => typeof element === 'object')
  );
};

export const getContractUsefulMethods = (
  contractABI: string | undefined | null,
) => {
  let parsedContractABI: JsonFragment[] = [];
  let usefulMethods: AbiItemExtended[] = [];

  try {
    parsedContractABI = JSON.parse(contractABI || '[]');
    if (!isAbiItem(parsedContractABI)) {
      throw new Error('Contract ABI is not valid');
    }
  } catch (error) {
    console.error(error);
    parsedContractABI = [];
  } finally {
    usefulMethods = extractUsefulMethods(parsedContractABI);
  }

  return usefulMethods;
};
