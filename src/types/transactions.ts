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
  group: {
    key: string;
    id: string;
    index: number;
    title?: MessageDescriptor;
    titleValues?: SimpleMessageValues;
    description?: MessageDescriptor;
    descriptionValues?: SimpleMessageValues;
  };
  hash?: string;
  identifier?: string;
  methodContext?: string;
  methodName: string;
  options?: Overrides;
  params?: MethodParams;
  ready?: boolean;
  title?: MessageDescriptor;
  titleValues?: SimpleMessageValues;
}

export interface TransactionResponse {
  receipt?: TransactionReceipt;
  eventData?: object;
  error?: Error;
}

export enum ExtendedClientType {
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
  AnnotateTransaction = 'annotateTransaction',
  CancelDraftExpenditure = 'cancelDraftExpenditure',
  CancelLockedExpenditure = 'cancelLockedExpenditure',
  CancelStakedExpenditure = 'cancelStakedExpenditure',
  CancelMultiSig = 'cancelMultiSig',
  ClaimColonyFunds = 'claimColonyFunds',
  ClaimExpenditure = 'claimExpenditure',
  CreateColony = 'createColony',
  FinishCreateColony = 'finishCreateColony',
  CreateDomain = 'createDomain',
  CreateExpenditure = 'createExpenditure',
  CreateMotion = 'createMotion',
  CreateStreamingPayment = 'createStreamingPayment',
  Crypto2Fiat = 'crypto2Fiat',
  DeployToken = 'deployToken',
  DeployTokenViaNetwork = 'deployTokenViaNetwork',
  DeployTokenAuthority = 'deployTokenAuthority',
  Deposit = 'deposit',
  DeprecateExtension = 'deprecateExtension',
  EditColony = 'editColony',
  EditColonyByDelta = 'editColonyByDelta',
  EditDomain = 'editDomain',
  EnableExtension = 'enableExtension',
  EscalateMotion = 'escalateMotion',
  FinalizeExpenditure = 'finalizeExpenditure',
  FinalizeMotion = 'finalizeMotion',
  FinalizeMultiSig = 'finalizeMultiSig',
  FundExpenditure = 'fundExpenditure',
  InitiateSafeTransaction = 'initiateSafeTransaction',
  InstallExtension = 'installExtension',
  InstallAndEnableExtension = 'installAndEnableExtension',
  LockExpenditure = 'lockExpenditure',
  ManageTokens = 'manageTokens',
  MintTokens = 'mintTokens',
  MoveFunds = 'moveFunds',
  Payment = 'payment',
  ReclaimStake = 'reclaimStake',
  ReleaseExpenditure = 'releaseExpenditure',
  RemoveVerifiedMembers = 'removeVerifiedMembers',
  SetUserRoles = 'setUserRoles',
  SetMultiSigThresholds = 'setMultiSigThresholds',
  StakeMotion = 'stakeMotion',
  UninstallExtension = 'uninstallExtension',
  UnlockToken = 'unlockToken',
  Upgrade = 'upgrade',
  UpgradeExtension = 'upgradeExtension',
  VoteOnMultiSig = 'voteOnMultiSig',
}
