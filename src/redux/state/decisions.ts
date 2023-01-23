import { Record, Map as ImmutableMap } from 'immutable';

import { CORE_DECISIONS_LIST } from '~redux/constants';
import { DecisionRecord } from '~redux/immutable/Decision';
import { Address, Decision, DefaultValues, RecordToJS } from '~types';

type DecisionsListObject = { [walletAddress: Address]: Decision };

type DecisionsListMap = ImmutableMap<Address, DecisionRecord> & {
  toJS(): DecisionsListObject;
};

interface CoreDecisionsProps {
  [CORE_DECISIONS_LIST]: DecisionsListMap;
}

const defaultValues: DefaultValues<CoreDecisionsProps> = {
  list: ImmutableMap() as DecisionsListMap,
};

export class CoreDecisionsRecord
  extends Record(defaultValues)
  implements RecordToJS<{ [CORE_DECISIONS_LIST]: DecisionsListObject }> {}

export const CoreDecisions = (p?: CoreDecisionsProps) =>
  new CoreDecisionsRecord(p);
