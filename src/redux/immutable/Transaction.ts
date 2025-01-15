import { type ClientType } from '@colony/colony-js';
import { type TransactionReceipt } from '@ethersproject/providers';
import { type BigNumber, type Overrides } from 'ethers';
import { type MessageDescriptor } from 'react-intl';

import { type TransactionStatus } from '~gql';
import {
  type AddressOrENSName,
  type SimpleMessageValues,
} from '~types/index.ts';
import {
  type MethodParams,
  type ExtendedClientType,
  type TransactionErrors,
} from '~types/transactions.ts';

export interface TransactionError {
  type: TransactionErrors;
  message: string;
}

export type TransactionId = string;

interface TransactionRecordProps {
  associatedActionId?: string;
  colonyAddress: string;
  context: ClientType | ExtendedClientType;
  createdAt: Date;
  deployedContractAddress?: string;
  deleted?: boolean;
  error?: TransactionError;
  eventData?: object;
  from: string;
  gasLimit?: string | BigNumber | null;
  gasPrice?: string | BigNumber | null;
  groupId: string;
  group: {
    key: string;
    id: string;
    index: number;
    title?: MessageDescriptor;
    titleValues?: SimpleMessageValues;
    description?: MessageDescriptor;
    descriptionValues?: SimpleMessageValues;
  };
  hash: string;
  id: TransactionId;
  identifier?: AddressOrENSName;
  methodContext?: string; // Context in which method is used e.g. setOneTxRole
  methodName: string;
  options?: Overrides;
  params?: MethodParams;
  receipt?: TransactionReceipt;
  status: TransactionStatus;
  loadingRelated?: boolean;
  title?: MessageDescriptor;
  titleValues?: SimpleMessageValues;
}

export type TransactionType = Readonly<TransactionRecordProps>;
