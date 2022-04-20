import { Record, Map as ImmutableMap } from 'immutable';

import { FetchableDataRecord, FetchableDataType } from '../immutable';
import { CORE_NAMESPACE, USERS_NAMESPACE } from '../constants';

import { CoreStateRecord } from './core';
import { UsersStateRecord } from './users';

export type IpfsDataType = ImmutableMap<string, FetchableDataRecord<string>> & {
  toJS(): { [hash: string]: FetchableDataType<string> };
};

export interface RootStateProps {
  core: CoreStateRecord;
  users: UsersStateRecord;
}

export class RootStateRecord extends Record<RootStateProps>({
  [CORE_NAMESPACE]: new CoreStateRecord(),
  [USERS_NAMESPACE]: new UsersStateRecord(),
}) {}
