import { defineMessages } from 'react-intl';
import { Colony } from '~types';

export const getManageSafeDialogPayload = (colony: Colony, payload: any) => {
  const { safe } = payload;

  return {
    colony,
    safeList: [
      {
        chainId: safe.chainId,
        name: safe.name,
        address: safe.walletAddress,
        moduleContractAddress: safe.id,
      },
    ],
  };
};

export enum TransactionTypes {
  TRANSFER_FUNDS = 'transferFunds',
  TRANSFER_NFT = 'transferNft',
  CONTRACT_INTERACTION = 'contractInteraction',
  RAW_TRANSACTION = 'rawTransaction',
  MULTIPLE_TRANSACTIONS = 'multipleTransactions',
}

export const MSG = defineMessages({
  [TransactionTypes.TRANSFER_FUNDS]: {
    id: `common.ControlSafeDialog.ControlSafeForm.${TransactionTypes.TRANSFER_FUNDS}`,
    defaultMessage: 'Transfer funds',
  },
  [TransactionTypes.TRANSFER_NFT]: {
    id: `common.ControlSafeDialog.ControlSafeForm.${TransactionTypes.TRANSFER_NFT}`,
    defaultMessage: 'Transfer NFT',
  },
  [TransactionTypes.CONTRACT_INTERACTION]: {
    id: `common.ControlSafeDialog.ControlSafeForm.${TransactionTypes.CONTRACT_INTERACTION}`,
    defaultMessage: 'Contract interaction',
  },
  [TransactionTypes.RAW_TRANSACTION]: {
    id: `common.ControlSafeDialog.ControlSafeForm.${TransactionTypes.RAW_TRANSACTION}`,
    defaultMessage: 'Raw transaction',
  },
});

export const transactionOptions = [
  {
    value: TransactionTypes.TRANSFER_FUNDS,
    label: MSG[TransactionTypes.TRANSFER_FUNDS],
  },
  {
    value: TransactionTypes.TRANSFER_NFT,
    label: MSG[TransactionTypes.TRANSFER_NFT],
  },
  {
    value: TransactionTypes.CONTRACT_INTERACTION,
    label: MSG[TransactionTypes.CONTRACT_INTERACTION],
  },
  {
    value: TransactionTypes.RAW_TRANSACTION,
    label: MSG[TransactionTypes.RAW_TRANSACTION],
  },
];

export const defaultTransaction = {
  // type SafeTransaction
  transactionType: '',
  tokenData: null,
  amount: null,
  rawAmount: null,
  recipient: undefined,
  data: '',
  contract: null,
  abi: '',
  contractFunction: '',
  nft: null,
  nftData: null,
  functionParamTypes: null,
};

export enum ContractFunctions {
  TRANSFER_FUNDS = 'transfer',
  TRANSFER_NFT = 'safeTransferFrom',
}
