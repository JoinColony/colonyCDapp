import { Watcher } from '~types';

export interface MembersAvatarsProps<TValue extends Watcher> {
  currentDomainId?: number;
  maxAvatars?: number;
  className?: string;
  loading: boolean;
  watchers: TValue[];
}
