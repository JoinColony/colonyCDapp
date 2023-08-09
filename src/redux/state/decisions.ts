import { Record, Map as ImmutableMap } from 'immutable';

import { CORE_DECISIONS_LIST } from '~redux/constants';
import { DecisionRecord } from '~redux/immutable/Decision';
import { Address, DefaultValues, RecordToJS } from '~types';
import { DecisionDraft } from '~utils/decisions';

type DecisionsListObject = {
  [walletAddress_colonyAddress: Address]: DecisionDraft;
};

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
