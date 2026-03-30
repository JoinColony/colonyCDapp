import { type JsonFragment } from '@ethersproject/abi';
import { keccak256, toUtf8Bytes } from 'ethers/lib/utils';

import { ARBITRARY_TRANSACTION_NETWORKS } from '~constants/index.ts';
import clientSecrets from '~utils/clientSecrets.ts';

export interface AbiItemExtended extends JsonFragment {
  name: string;
  type: 'function';
  action: string;
  methodSignature: string;
  signatureHash: string;
}

const getCurrentNetworkData = (chainId: string) => {
  return ARBITRARY_TRANSACTION_NETWORKS.find(
    (network) => network.chainId === chainId,
  );
};

export const fetchContractABI = async (
  contractAddress: string,
  chainId: string,
) => {
  if (!contractAddress) {
    return [];
  }

  try {
    // will be defined since fetchContractABI is only called if selectedSafe is defined

    const currentNetworkData = getCurrentNetworkData(chainId)!;

    const { arbiscanApiKey: apiKey } = clientSecrets;
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
