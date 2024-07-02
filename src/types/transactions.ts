import { type TransactionReceipt } from '@ethersproject/providers';
import { type BigNumberish, type Overrides } from 'ethers';
import { type MessageDescriptor } from 'react-intl';

import { TransactionErrors } from '~gql';

import { type SimpleMessageValues } from './index.ts';

export type MethodParam = string | BigNumberish | boolean;

export { TransactionErrors };
export type MethodParams = (MethodParam | MethodParam[] | MethodParam[][])[];

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

export enum TRANSACTION_METHODS {
  AddVerifiedMembers = 'addVerifiedMembers',
  Approve = 'approve',
  CancelDraftExpenditure = 'cancelDraftExpenditure',
  CancelStakedExpenditure = 'cancelStakedExpenditure',
  ClaimColonyFunds = 'claimColonyFunds',
  ClaimExpenditure = 'claimExpenditure',
  CreateColony = 'createColony',
  CreateDomainAction = 'createDomainAction',
  CreateExpenditure = 'createExpenditure',
  CreateMotion = 'createMotion',
  CreateStreamingPayment = 'createStreamingPayment',
  DeployToken = 'deployToken',
  DeployTokenViaNetwork = 'deployTokenViaNetwork',
  DeployTokenAuthority = 'deployTokenAuthority',
  Deposit = 'deposit',
  EditColonyAction = 'editColonyAction',
  EditDomainAction = 'editDomainAction',
  EnableExtension = 'enableExtension',
  EscalateMotion = 'escalateMotion',
  FinalizeExpenditure = 'finalizeExpenditure',
  FinalizeMotion = 'finalizeMotion',
  FundExpenditure = 'fundExpenditure',
  InitiateSafeTransaction = 'initiateSafeTransaction',
  LockExpenditure = 'lockExpenditure',
  ManageTokens = 'manageTokens',
  MintTokens = 'mintTokens',
  MoveFunds = 'moveFunds',
  PaymentAction = 'paymentAction',
  ReleaseExpenditure = 'releaseExpenditure',
  RemoveVerifiedMembers = 'removeVerifiedMembers',
  SetUserRoles = 'setUserRoles',
  StakeMotion = 'stakeMotion',
  TokenUnlockAction = 'tokenUnlockAction',
  Upgrade = 'upgrade',
}
