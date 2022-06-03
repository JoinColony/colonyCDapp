import { TransactionReceipt } from '@ethersproject/providers';
import { BigNumberish } from 'ethers';
import { TransactionOverrides } from '@colony/colony-js';

import { TransactionMultisig } from '~immutable/index';

export type MethodParam = string | BigNumberish | boolean;
export type MethodParams = (MethodParam | MethodParam[])[];

export interface TxConfig {
  context: string;
  group?: {
    key: string;
    id: string | string[];
    index: number;
  };
  identifier?: string;
  methodContext?: string;
  methodName: string;
  multisig?: boolean | TransactionMultisig;
  options?: TransactionOverrides;
  params?: MethodParams;
  ready?: boolean;
}

export interface TransactionResponse {
  receipt?: TransactionReceipt;
  eventData?: object;
  error?: Error;
}

export interface MultisigOperationJSON {
  nonce: number;
  payload: object; // MultisigOperationPayload
  signers: object; // Signers
}

export enum ExtendedReduxContext {
  WrappedToken = 'WrappedToken',
  VestingSimple = 'VestingSimple',
}
