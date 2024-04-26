import { type MultiSigVote } from '~gql';

export enum MultiSigState {
  Approval = 'Approval',
  Finalize = 'Finalize',
}

export interface MultiSigSignee {
  userAddress?: string;
  vote: MultiSigVote;
}

export enum VoteExpectedStep {
  vote = 'vote',
  cancel = 'cancel',
}
