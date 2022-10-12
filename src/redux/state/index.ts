import { Record, Map as ImmutableMap } from 'immutable';

import { FetchableDataRecord, FetchableDataType } from '../immutable';
import { CORE_NAMESPACE } from '../constants';

import { CoreStateRecord } from './core';

export type IpfsDataType = ImmutableMap<string, FetchableDataRecord<string>> & {
  toJS(): { [hash: string]: FetchableDataType<string> };
};

export interface RootStateProps {
  core: CoreStateRecord;
}

export class RootStateRecord extends Record<RootStateProps>({
  [CORE_NAMESPACE]: new CoreStateRecord(),
}) {}
