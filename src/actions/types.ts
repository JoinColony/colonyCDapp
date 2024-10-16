import { type ColonyRole } from '@colony/colony-js';
import { type FC } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { type MessageDescriptor } from 'react-intl';

import { type CreateActionFormProps } from '~v5/common/ActionSidebar/types.ts';

import { type CoreAction, type CoreActionGroup } from './core/types.ts';

export { type ColonyActionFragment as ActionData } from '~gql';

// FIXME: check all CoreActions in all files whether they should actually be CoreActionOrGroup
export type CoreActionOrGroup = CoreAction | CoreActionGroup;

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

type ActionMessageDescriptor = Required<Omit<MessageDescriptor, 'description'>>;

interface MinimalActionDefinition {
  // FIXME: eventually we want to get rid of CreateActionFormProps (especially getFormOptions)
  component?: FC<CreateActionFormProps>;
  name: ActionMessageDescriptor;
  permissionDomainId?: (form: UseFormReturn) => number;
  requiredPermissions?:
    | ColonyRole[][]
    | ((form: UseFormReturn) => ColonyRole[][]);
  title?: ActionMessageDescriptor;
  titleKeys?: ActionTitleKey[];
  type: CoreAction;
  // @TODO: add this later
  // validationSchema: ObjectSchema;
}

export type ActionDefinition = Omit<MinimalActionDefinition, 'type'> & {
  actions?: Record<string, MinimalActionDefinition>;
  type: CoreActionOrGroup;
};
