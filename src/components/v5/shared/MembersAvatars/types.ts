import { VoterRecordFragment } from '~gql';

export interface MembersAvatarsProps<TValue extends VoterRecordFragment> {
  maxAvatarsToShow?: number;
  className?: string;
  items: TValue[];
}
