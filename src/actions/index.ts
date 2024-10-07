import { type CoreAction, type CoreActionGroup } from './core/types.ts';

export { CoreAction, CoreActionGroup } from './core/types.ts';

// FIXME: check all CoreActions in all files whether they should actually be CoreActionOrGroup
export type CoreActionOrGroup = CoreAction | CoreActionGroup;

export { type ColonyActionFragment as ActionData } from '~gql';

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

export { registerAction } from './utils.ts';
