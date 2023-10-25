import { VoterRecordFragment } from '~gql';

export interface MembersAvatarsProps<TValue extends VoterRecordFragment> {
  maxAvatars?: number;
  className?: string;
  items: TValue[];
}
