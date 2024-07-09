import { type ColonyRole } from '@colony/colony-js';

import { type MultiSigVote } from '~gql';
import { type User } from '~types/graphql.ts';

export enum MultiSigState {
  Approval = 'Approval',
  Finalize = 'Finalize',
}

export interface MultiSigSignee {
  userAddress?: string;
  user: Partial<User>;
  vote: MultiSigVote;
  rolesSignedWith: ColonyRole[];
  userRoles: ColonyRole[];
}

export enum VoteExpectedStep {
  vote = 'vote',
  cancel = 'cancel',
}
