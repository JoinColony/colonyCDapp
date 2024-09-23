import { getTokenClient } from '@colony/colony-js';
import { AddressZero } from '@ethersproject/constants';
import { type Contract, ethers } from 'ethers';
import { FormatTypes } from 'ethers/lib/utils';
import moveDecimal from 'move-decimal-point';

import {
  GNOSIS_AMB_BRIDGES,
  isDev,
  type NetworkInfo,
  SUPPORTED_SAFE_NETWORKS,
} from '~constants/index.ts';
import { ContextModule, getContext } from '~context/index.ts';
import {
  type Safe,
  type SafeTransactionData,
  SafeTransactionType,
} from '~types/graphql.ts';
import { type Address } from '~types/index.ts';
import { type ModuleAddress } from '~types/safes.ts';
import { fetchTokenFromDatabase } from '~utils/queries.ts';
import { getArrayFromString } from '~utils/safes/index.ts';

import retryProviderFactory from '../wallet/RetryProvider.ts';

import { erc721, ForeignAMB, HomeAMB, ZodiacBridgeModule } from './abis.ts'; // Temporary

const safeAddressesUrl = new URL(
  import.meta.env.VITE_NETWORK_FILES_ENDPOINT || 'http://localhost:3006',
);

interface SafeAddresses {
  LOCAL_FOREIGN_BRIDGE_ADDRESS?: string;
  LOCAL_HOME_BRIDGE_ADDRESS?: string;
  LOCAL_SAFE_ADDRESS?: string;
  LOCAL_ERC721_ADDRESS?: string;
  LOCAL_SAFE_TOKEN_ADDRESS?: string;
  ZODIAC_BRIDGE_MODULE_ADDRESS?: string;
}

export interface SafeTxData {
  title: string;
  transactions: SafeTransactionData[];
  safeData: Omit<Safe, 'safeName' | 'moduleContractAddress'>;
  annotationMessage?: string;
}

export interface SelectedSafe {
  id: ModuleAddress; // Making explicit that this is the module address
  profile: {
    displayName: string;
    walletAddress: Address; // And this is the safe address
  };
}

export interface SelectedNFT extends SelectedSafe {
  id: string; // id is address + id,
}

const LOCAL_FOREIGN_CHAIN = 'http://127.0.0.1:8546';
const LOCAL_TOKEN_ID = 1; // set in start-bridging-environment.js

let SAFE_ADDRESSES: SafeAddresses | null = null;

export const getSafeAddresses = async (): Promise<SafeAddresses> => {
  if (!isDev || !(import.meta.env.SAFE_ENABLED === 'true'))
    return {} as SafeAddresses;
  if (SAFE_ADDRESSES) return SAFE_ADDRESSES;
  const addresses = await fetch(`${safeAddressesUrl.href}safe-addresses.json`);
  SAFE_ADDRESSES = await addresses.json();
  return SAFE_ADDRESSES as SafeAddresses;
};

export const getHomeProvider = () => {
  const wallet = getContext(ContextModule.Wallet);
  const RetryProvider = retryProviderFactory(wallet.label);
  return new RetryProvider();
};

export const getForeignProvider = (safeChainId: string) => {
  const network = SUPPORTED_SAFE_NETWORKS.find(
    (n) => n.chainId === safeChainId,
  );

  if (!network) {
    throw new Error(
      `Network not found. Please ensure safe is deployed to a supported network.`,
    );
  }

  return new ethers.providers.JsonRpcProvider(
    isDev ? LOCAL_FOREIGN_CHAIN : network.rpcUrl,
  );
};

export const getForeignBridgeByChain = async (safeChainId: string) => {
  const { LOCAL_FOREIGN_BRIDGE_ADDRESS } = await getSafeAddresses();

  const foreignProvider = getForeignProvider(safeChainId);
  const foreignSigner = foreignProvider.getSigner();
  const foreignBridgeAddress: string | undefined = isDev
    ? LOCAL_FOREIGN_BRIDGE_ADDRESS
    : GNOSIS_AMB_BRIDGES[safeChainId]?.foreignAMB;

  if (!foreignBridgeAddress) {
    throw new Error(
      `Foreign bridge address for chain with chainID ${safeChainId} not found.`,
    );
  }
  // @ts-ignore abi type is wrong.
  return new ethers.Contract(foreignBridgeAddress, ForeignAMB, foreignSigner);
};

export const getHomeBridgeByChain = async (safeChainId: string) => {
  const { LOCAL_HOME_BRIDGE_ADDRESS } = await getSafeAddresses();
  const homeProvider = getHomeProvider();
  const homeSigner = homeProvider.getSigner();
  const homeBridgeAddress: string | undefined = isDev
    ? LOCAL_HOME_BRIDGE_ADDRESS
    : GNOSIS_AMB_BRIDGES[safeChainId]?.homeAMB;

  if (!homeBridgeAddress) {
    throw new Error(
      `Home bridge address for chain with chainID ${safeChainId} not found.`,
    );
  }
  // @ts-ignore abi type is wrong.
  return new ethers.Contract(homeBridgeAddress, HomeAMB, homeSigner);
};

const getErc721 = (safe: Safe, erc721Address: Address) => {
  const foreignProvider = getForeignProvider(safe.chainId);

  return new ethers.Contract(
    erc721Address,
    erc721.default.abi,
    foreignProvider,
  );
};

const getTokenInterface = async (safe: Safe, tokenAddress: Address) => {
  const foreignProvider = getForeignProvider(safe.chainId);
  const tokenClient = await getTokenClient(tokenAddress, foreignProvider);
  return tokenClient.interface;
};

export const getZodiacModule = (zodiacModuleAddress: Address, safe: Safe) => {
  const foreignProvider = getForeignProvider(safe.chainId);

  return new ethers.Contract(
    zodiacModuleAddress,
    ZodiacBridgeModule,
    foreignProvider,
  );
};

export const getTxServiceBaseUrl = (selectedChain: string) => {
  const selectedNetwork = SUPPORTED_SAFE_NETWORKS.find(
    (network) => network.name === selectedChain,
  );

  if (!selectedNetwork || !selectedNetwork.safeTxService) {
    throw new Error(`Selected chain ${selectedChain} not currently supported.`);
  }

  return selectedNetwork.safeTxService;
};

export const getTokenIdFromNFTId = (nftId: SelectedNFT['id']) => {
  const chunks = nftId.split(' ');
  return chunks[chunks.length - 1];
};

export const nftNameContainsTokenId = (tokenName: string): boolean => {
  const chunks = tokenName.trim().split(' ');
  // using 'starts with #' to identify a token id
  if (chunks[chunks.length - 1].startsWith('#')) {
    return true;
  }

  return false;
};

// in the event the token id is also appended to the token name
export const extractTokenName = (tokenName: string) => {
  const chunks = tokenName.trim().split(' ');
  // using 'starts with #' to identify a token id
  if (chunks[chunks.length - 1].startsWith('#')) {
    return chunks.slice(0, chunks.length - 1).join(' ');
  }

  return tokenName;
};

export const getRawTransactionData = (
  zodiacBridgeModule: Contract,
  transaction: SafeTransactionData,
) => {
  if (!transaction.recipient) {
    throw new Error('Transaction does not contain a recipient.');
  }

  if (transaction.rawAmount === null) {
    throw new Error('Transaction does not contain an amount');
  }

  return zodiacBridgeModule.interface.encodeFunctionData('executeTransaction', [
    transaction.recipient.walletAddress,
    transaction.rawAmount,
    transaction.data,
    0,
  ]);
};

export const getTransferNFTData = async (
  zodiacBridgeModule: Contract,
  safe: Safe,
  transaction: SafeTransactionData,
) => {
  if (!transaction.nftData) {
    throw new Error('Transaction does not contain NFT data.');
  }

  if (!transaction.recipient) {
    throw new Error('Transaction does not contain a recipient.');
  }

  const { LOCAL_SAFE_ADDRESS, LOCAL_ERC721_ADDRESS } = await getSafeAddresses();

  // If this function is called, nftData will be defined.

  const nftData = transaction.nftData!;
  const safeAddress = isDev ? LOCAL_SAFE_ADDRESS : safe.address;
  const tokenId = isDev ? LOCAL_TOKEN_ID : Number(nftData.id);
  const erc721Address = isDev ? LOCAL_ERC721_ADDRESS : nftData.address;

  if (!safeAddress) {
    throw new Error('LOCAL_SAFE_ADDRESS not set in .env.');
  }

  if (!erc721Address) {
    throw new Error('LOCAL_ERC721_ADDRESS not set in .env.');
  }

  const erc721Contract = getErc721(safe, erc721Address);

  const safeTransferFromFn = erc721Contract.interface.encodeFunctionData(
    'safeTransferFrom(address,address,uint256)',
    [safeAddress, transaction.recipient.walletAddress, tokenId],
  );

  return zodiacBridgeModule.interface.encodeFunctionData('executeTransaction', [
    erc721Address,
    0,
    safeTransferFromFn,
    0,
  ]);
};

export const getTransferFundsData = async ({
  zodiacBridgeModule,
  safe,
  transaction,
  network,
}: {
  zodiacBridgeModule: Contract;
  safe: Safe;
  transaction: SafeTransactionData;
  network: NetworkInfo;
}) => {
  if (!transaction.token) {
    throw new Error('Transaction does not contain token data.');
  }

  if (!transaction.recipient) {
    throw new Error('Transaction does not contain a recipient.');
  }

  const { LOCAL_SAFE_ADDRESS, LOCAL_SAFE_TOKEN_ADDRESS } =
    await getSafeAddresses();

  const safeAddress = isDev ? LOCAL_SAFE_ADDRESS : safe.address;
  const tokenAddress = isDev
    ? LOCAL_SAFE_TOKEN_ADDRESS
    : transaction.token.tokenAddress;

  if (!safeAddress) {
    throw new Error('LOCAL_SAFE_ADDRESS not set in .env.');
  }

  if (!tokenAddress) {
    throw new Error('LOCAL_SAFE_TOKEN_ADDRESS not set in .env.');
  }

  const isSafeNativeToken = tokenAddress === AddressZero;

  /**
   * Call to check if the token is already in database
   * and add it if it isn't
   */
  if (!isSafeNativeToken) {
    await fetchTokenFromDatabase(transaction.token.tokenAddress, network);
  }

  const tokenDecimals = transaction.token.decimals;
  const { recipient } = transaction;

  const getAmount = (): number | string => {
    if (isSafeNativeToken) {
      return moveDecimal(transaction.amount, tokenDecimals); // moveDecimal returns a string
    }
    return 0;
  };

  const getData = async () => {
    if (isSafeNativeToken) {
      return '0x';
    }
    const TokenInterface = await getTokenInterface(safe, tokenAddress);
    const transferAmount = moveDecimal(transaction.amount, tokenDecimals);
    return TokenInterface.encodeFunctionData('transfer', [
      recipient.walletAddress,
      transferAmount,
    ]);
  };

  const getRecipient = (): string => {
    if (isSafeNativeToken) {
      return recipient.walletAddress;
    }
    return tokenAddress;
  };

  return zodiacBridgeModule.interface.encodeFunctionData('executeTransaction', [
    getRecipient(),
    getAmount(),
    await getData(),
    0,
  ]);
};

const isArrayParameter = (parameter: string): boolean =>
  parameter[0] + parameter[parameter.length - 1] === '[]';

const extractMethodArgs =
  (functionName: string, transaction: Record<string, any>) =>
  ({ name = '' }) => {
    const paramName = `${name}-${functionName}`;
    if (isArrayParameter(transaction[paramName])) {
      return getArrayFromString(transaction[paramName]);
    }
    return transaction[paramName];
  };

export const getContractInteractionData = async (
  zodiacBridgeModule: Contract,
  safe: Safe,
  transaction: SafeTransactionData,
) => {
  if (!transaction.abi) {
    throw new Error('Transaction does not contain an ABI.');
  }

  if (!transaction.contract) {
    throw new Error('Transaction does not contain a contract address.');
  }

  if (!transaction.contractFunction) {
    throw new Error('Transaction does not contain a contract function.');
  }

  const { LOCAL_SAFE_ADDRESS, LOCAL_SAFE_TOKEN_ADDRESS } =
    await getSafeAddresses();

  const safeAddress = isDev ? LOCAL_SAFE_ADDRESS : safe.address;
  const contractAddress = isDev
    ? LOCAL_SAFE_TOKEN_ADDRESS
    : transaction.contract.walletAddress;
  let abi: string | string[];
  let contractFunction: string;

  if (!safeAddress) {
    throw new Error('LOCAL_SAFE_ADDRESS not set in .env.');
  }

  if (!contractAddress) {
    throw new Error('LOCAL_SAFE_TOKEN_ADDRESS not set in .env.');
  }

  if (isDev) {
    const TokenInterface = await getTokenInterface(safe, contractAddress);

    abi = TokenInterface.format(FormatTypes.json);
    contractFunction = 'transferFrom(address,address,uint256)';
  } else {
    abi = transaction.abi;
    contractFunction = transaction.contractFunction;
  }

  const getData = () => {
    const foreignProvider = getForeignProvider(safe.chainId);
    const contract = new ethers.Contract(contractAddress, abi, foreignProvider);
    const { inputs, name = '' } =
      contract.interface.functions[contractFunction];

    const transactionValues = isDev
      ? {
          ...transaction,
          // src, dst and wad are the param names of the transferFrom function
          [`src-transferFrom`]: safeAddress,
          [`dst-transferFrom`]: AddressZero,
          [`wad-transferFrom`]: 1,
        }
      : transaction;
    const args = inputs?.map(extractMethodArgs(name, transactionValues)) || [];

    return contract.interface.encodeFunctionData(name, args);
  };

  const encodedData = getData();

  return zodiacBridgeModule.interface.encodeFunctionData('executeTransaction', [
    contractAddress,
    0,
    encodedData,
    0,
  ]);
};

export const getChainNameFromSafe = (safeDisplayName: string) => {
  return safeDisplayName.match(/\(([^()]*)\)$/)?.pop() || '';
};

export function* getTransactionEncodedData({
  transactions,
  safe,
  network,
  homeBridge,
}: {
  transactions: SafeTransactionData[];
  safe: Safe;
  network: NetworkInfo;
  homeBridge: Contract;
}) {
  const { ZODIAC_BRIDGE_MODULE_ADDRESS } = yield getSafeAddresses();
  const zodiacBridgeModuleAddress = isDev
    ? ZODIAC_BRIDGE_MODULE_ADDRESS
    : safe.moduleContractAddress;

  if (!zodiacBridgeModuleAddress) {
    throw new Error(
      `Please provide a ZODIAC_BRIDGE_MODULE_ADDRESS. If running local, please add key-pair to your .env file.`,
    );
  }

  const zodiacBridgeModule = getZodiacModule(zodiacBridgeModuleAddress, safe);
  const transactionData: string[] = [];
  /*
   * Calls HomeBridge for each Tx, with the Colony as the sender.
   * Loop necessary as yield cannot be called inside of an array iterator (like forEach).
   */

  for (const transaction of transactions) {
    let txDataToBeSentToZodiacModule = '';
    switch (transaction.transactionType) {
      case SafeTransactionType.RawTransaction:
        txDataToBeSentToZodiacModule = getRawTransactionData(
          zodiacBridgeModule,
          transaction,
        );
        break;
      case SafeTransactionType.TransferNft:
        txDataToBeSentToZodiacModule = yield getTransferNFTData(
          zodiacBridgeModule,
          safe,
          transaction,
        );
        break;
      case SafeTransactionType.TransferFunds:
        txDataToBeSentToZodiacModule = yield getTransferFundsData({
          zodiacBridgeModule,
          safe,
          transaction,
          network,
        });
        break;
      case SafeTransactionType.ContractInteraction:
        txDataToBeSentToZodiacModule = yield getContractInteractionData(
          zodiacBridgeModule,
          safe,
          transaction,
        );
        break;
      default:
        throw new Error(
          `Unknown transaction type: ${transaction.transactionType}`,
        );
    }

    const txDataToBeSentToAMB = yield homeBridge.interface.encodeFunctionData(
      'requireToPassMessage',
      [zodiacBridgeModule.address, txDataToBeSentToZodiacModule, 1000000],
    );

    transactionData.push(txDataToBeSentToAMB);
  }

  return transactionData;
}
