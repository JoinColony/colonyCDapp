import Web3 from 'web3';
import { getTokenClient } from '@colony/colony-js';
import { Contract, ethers } from 'ethers';
import moveDecimal from 'move-decimal-point';
import { AddressZero } from '@ethersproject/constants';
import { FormatTypes } from 'ethers/lib/utils';

import {
  Address,
  ModuleAddress,
  Safe,
  SafeTransactionData,
  SafeTransactionType,
} from '~types';
import {
  GNOSIS_AMB_BRIDGES,
  isDev,
  NetworkInfo,
  SUPPORTED_SAFE_NETWORKS,
} from '~constants';
import { getArrayFromString } from '~utils/safes';
import { fetchTokenFromDatabase } from '~utils/queries';

import { erc721, ForeignAMB, HomeAMB, ZodiacBridgeModule } from './abis'; // Temporary

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

/* eslint-disable prefer-destructuring, @typescript-eslint/no-var-requires, global-require, import/no-dynamic-require */
const LOCAL_HOME_BRIDGE_ADDRESS =
  // @ts-ignore
  isDev && !WEBPACK_IS_PRODUCTION && SAFE_ENABLED_LOCALLY === 'true'
    ? require('../../../../amplify/mock-data/colonyNetworkArtifacts/safe-addresses.json')
        .LOCAL_HOME_BRIDGE_ADDRESS
    : null;
const LOCAL_FOREIGN_BRIDGE_ADDRESS =
  // @ts-ignore
  isDev && !WEBPACK_IS_PRODUCTION && SAFE_ENABLED_LOCALLY === 'true'
    ? require('../../../../amplify/mock-data/colonyNetworkArtifacts/safe-addresses.json')
        .LOCAL_FOREIGN_BRIDGE_ADDRESS
    : null;
const LOCAL_ERC721_ADDRESS =
  // @ts-ignore
  isDev && !WEBPACK_IS_PRODUCTION && SAFE_ENABLED_LOCALLY === 'true'
    ? require('../../../../amplify/mock-data/colonyNetworkArtifacts/safe-addresses.json')
        .LOCAL_ERC721_ADDRESS
    : null;
const LOCAL_SAFE_ADDRESS =
  // @ts-ignore
  isDev && !WEBPACK_IS_PRODUCTION && SAFE_ENABLED_LOCALLY === 'true'
    ? require('../../../../amplify/mock-data/colonyNetworkArtifacts/safe-addresses.json')
        .LOCAL_SAFE_ADDRESS
    : null;
const LOCAL_SAFE_TOKEN_ADDRESS =
  // @ts-ignore
  isDev && !WEBPACK_IS_PRODUCTION && SAFE_ENABLED_LOCALLY === 'true'
    ? require('../../../../amplify/mock-data/colonyNetworkArtifacts/safe-addresses.json')
        .LOCAL_SAFE_TOKEN_ADDRESS
    : null;
export const ZODIAC_BRIDGE_MODULE_ADDRESS =
  // @ts-ignore
  isDev && !WEBPACK_IS_PRODUCTION && SAFE_ENABLED_LOCALLY === 'true'
    ? require('../../../../amplify/mock-data/colonyNetworkArtifacts/safe-addresses.json')
        .ZODIAC_BRIDGE_MODULE_ADDRESS
    : null;
/* eslint-enable prefer-destructuring, @typescript-eslint/no-var-requires, global-require, import/no-dynamic-require */

const LOCAL_HOME_CHAIN = 'http://127.0.0.1:8545';
const LOCAL_FOREIGN_CHAIN = 'http://127.0.0.1:8546';
const LOCAL_TOKEN_ID = 1; // set in start-bridging-environment.js

export const getHomeProvider = () => {
  return isDev
    ? new ethers.providers.JsonRpcProvider(LOCAL_HOME_CHAIN)
    : new ethers.providers.Web3Provider(Web3.givenProvider); // Metamask
};

export const getForeignProvider = (safeChainId: number) => {
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

export const getForeignBridgeByChain = (safeChainId: number) => {
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

export const getHomeBridgeByChain = (safeChainId: number) => {
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

export const getTransferNFTData = (
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

  // If this function is called, nftData will be defined.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

  // eslint-disable-next-line max-len
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

export const getTransferFundsData = async (
  zodiacBridgeModule: Contract,
  safe: Safe,
  transaction: SafeTransactionData,
  network: NetworkInfo,
) => {
  if (!transaction.token) {
    throw new Error('Transaction does not contain token data.');
  }

  if (!transaction.recipient) {
    throw new Error('Transaction does not contain a recipient.');
  }

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

export function* getTransactionEncodedData(
  transactions: SafeTransactionData[],
  safe: Safe,
  network: NetworkInfo,
  homeBridge: Contract,
) {
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
  /* eslint-disable-next-line no-restricted-syntax */
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
        txDataToBeSentToZodiacModule = getTransferNFTData(
          zodiacBridgeModule,
          safe,
          transaction,
        );
        break;
      case SafeTransactionType.TransferFunds:
        txDataToBeSentToZodiacModule = yield getTransferFundsData(
          zodiacBridgeModule,
          safe,
          transaction,
          network,
        );
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

    /* eslint-disable-next-line max-len */
    const txDataToBeSentToAMB = yield homeBridge.interface.encodeFunctionData(
      'requireToPassMessage',
      [zodiacBridgeModule.address, txDataToBeSentToZodiacModule, 1000000],
    );

    transactionData.push(txDataToBeSentToAMB);
  }

  return transactionData;
}
