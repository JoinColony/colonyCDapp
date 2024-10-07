import { type ColonyRole } from '@colony/colony-js';

export type SingleRole = ColonyRole;
export type RoleGroup = ColonyRole[];
export type RoleGroupSet = ColonyRole[][];

export type RequiredColonyRoleGroup = SingleRole | RoleGroup | RoleGroupSet;

export enum DecisionMethod {
  Permissions = 'Permissions',
  Reputation = 'Reputation',
  MultiSig = 'MultiSig',
}

export enum ActionTitleKey {
  Amount = 'amount',
  Direction = 'direction',
  FromDomain = 'fromDomain',
  MultiSigAuthority = 'multiSigAuthority',
  Initiator = 'initiator',
  Members = 'members',
  NewVersion = 'newVersion',
  Version = 'version',
  Recipient = 'recipient',
  ReputationChange = 'reputationChange',
  ReputationChangeNumeral = 'reputationChangeNumeral',
  ToDomain = 'toDomain',
  TokenSymbol = 'tokenSymbol',
  ChainName = 'chainName',
  VerifiedMembers = 'verifiedMembers',
  SafeTransactionTitle = 'safeTransactionTitle',
  RecipientsNumber = 'recipientsNumber',
  TokensNumber = 'tokensNumber',
}
