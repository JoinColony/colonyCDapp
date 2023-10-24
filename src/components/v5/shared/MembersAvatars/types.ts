import { Watcher } from '~types';

export interface MembersAvatarsProps {
  currentDomainId?: number;
  maxAvatars?: number;
  className?: string;
  loading: boolean;
  watchers: Watcher[];
}
