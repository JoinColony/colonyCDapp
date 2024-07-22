import { type ColonyRole } from '@colony/colony-js';

import { type User } from '~types/graphql.ts';

export interface EligibleSignee {
  userAddress: string;
  user: Partial<User>;
  userRoles: ColonyRole[];
}
export type Threshold = { [role: number]: number } | null;
