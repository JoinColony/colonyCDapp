import { Record } from 'immutable';
import { BigNumber, Overrides } from 'ethers';
import { TransactionReceipt } from '@ethersproject/providers';
import { ClientType } from '@colony/colony-js';
import { MessageDescriptor } from 'react-intl';

import {
  AddressOrENSName,
  DefaultValues,
  MethodParams,
  RecordToJS,
  SimpleMessageValues,
  ExtendedClientType,
  TRANSACTION_ERRORS,
  TRANSACTION_STATUSES,
} from '~types';

export interface TransactionError {
  type: TRANSACTION_ERRORS;
  message: string;
}

export type TransactionId = string;

export interface TransactionRecordProps {
  context: ClientType | ExtendedClientType;
  createdAt: Date;
  deployedContractAddress?: string;
  error?: TransactionError;
  eventData?: object;
  from: string;
  gasLimit?: number;
  gasPrice?: BigNumber;
  group?: {
    key: string;
    id: string | string[];
    index: number;
    title?: MessageDescriptor;
    titleValues?: SimpleMessageValues;
    description?: MessageDescriptor;
    descriptionValues?: SimpleMessageValues;
  };
  hash?: string;
  id: TransactionId;
  identifier?: AddressOrENSName;
  methodContext?: string; // Context in which method is used e.g. setOneTxRole
  methodName: string;
  options: Overrides;
  params: MethodParams;
  receipt?: TransactionReceipt;
  status: TRANSACTION_STATUSES;
  loadingRelated?: boolean;
  metatransaction: boolean;
  title?: MessageDescriptor;
  titleValues?: SimpleMessageValues;
}

export type TransactionType = Readonly<TransactionRecordProps>;

const defaultValues: DefaultValues<TransactionRecordProps> = {
  // Just because we have to pick one
  context: undefined,
  createdAt: new Date(),
  deployedContractAddress: undefined,
  error: undefined,
  eventData: undefined,
  from: undefined,
  gasLimit: undefined,
  gasPrice: undefined,
  group: undefined,
  hash: undefined,
  id: undefined,
  identifier: undefined,
  methodContext: undefined,
  methodName: undefined,
  options: {},
  params: {},
  receipt: undefined,
  status: undefined,
  loadingRelated: false,
  metatransaction: false,
  title: undefined,
  titleValues: undefined,
};

export class TransactionRecord
  extends Record<TransactionRecordProps>(defaultValues)
  implements RecordToJS<TransactionType> {}

export const Transaction = (p: TransactionRecordProps) => new TransactionRecord(p);
