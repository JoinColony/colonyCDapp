import { VoterRecordFragment } from '~gql';
import { VoteStatuses } from '../../types';

export interface VoteStatusesProps {
  items: VoteStatuses[];
  voterRecord: VoterRecordFragment[];
}
