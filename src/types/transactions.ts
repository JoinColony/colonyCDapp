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

export enum ExtendedClientType {
  WrappedTokenClient = 'WrappedTokenClient',
  VestingSimpleClient = 'VestingSimpleClient',
  LightTokenClient = 'LightTokenClient',
}

export enum MetatransactionFlavour {
  Vanilla = 'vanillaMetatransactions',
  EIP2612 = 'eip2612Metatransactions',
}

export enum ContractRevertErrors {
  TokenUnauthorized = 'colony-token-unauthorised',
  MetaTxInvalidSignature = 'colony-metatx-invalid-signature',
  TokenInvalidSignature = 'colony-token-invalid-signature',
}

export enum MetamaskRpcErrors {
  /*
   * @NOTE We have to use the truncated error message, since the original one
   * is dynamic and we can't account for the various chain id's
   */
  TypedDataSignDifferentChain = 'must match the active chainId',
}

export enum TRANSACTION_ERRORS {
  ESTIMATE = 'ESTIMATE',
  EVENT_DATA = 'EVENT_DATA',
  RECEIPT = 'RECEIPT',
  SEND = 'SEND',
  UNSUCCESSFUL = 'UNSUCCESSFUL',
}

export enum TRANSACTION_STATUSES {
  CREATED = 'CREATED',
  READY = 'READY',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  SUCCEEDED = 'SUCCEEDED',
}

export enum TRANSACTION_METHODS {
  DeployToken = 'deployToken',
  DeployTokenViaNetwork = 'deployTokenViaNetwork',
  DeployTokenAuthority = 'deployTokenAuthority',
  Approve = 'approve',
}
