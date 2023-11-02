import { VoterRecord } from '~gql';

export interface UserAvatarsProps {
  maxAvatarsToShow?: number;
  className?: string;
  items: VoterRecord[];
}
