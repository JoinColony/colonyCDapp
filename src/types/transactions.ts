import { TransactionReceipt } from '@ethersproject/providers';
import { BigNumberish, Overrides } from 'ethers';
import { MessageDescriptor } from 'react-intl';

import { SimpleMessageValues } from './index';

export type MethodParam = string | BigNumberish | boolean;
export type MethodParams = (MethodParam | MethodParam[])[];

export interface TxConfig {
  context: string;
  group?: {
    key: string;
    id: string | string[];
    index: number;
    title?: MessageDescriptor;
    titleValues?: SimpleMessageValues;
    description?: MessageDescriptor;
    descriptionValues?: SimpleMessageValues;
  };
  identifier?: string;
  methodContext?: string;
  methodName: string;
  options?: Overrides;
  params?: MethodParams;
  ready?: boolean;
  metatransaction?: boolean;
  title?: MessageDescriptor;
  titleValues?: SimpleMessageValues;
}

export interface TransactionResponse {
  receipt?: TransactionReceipt;
  eventData?: object;
  error?: Error;
}
