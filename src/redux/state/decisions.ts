import { Record, Map as ImmutableMap } from 'immutable';

import { type CORE_DECISIONS_LIST } from '~redux/constants.ts';
import { type DecisionRecord } from '~redux/immutable/Decision.ts';
import {
  type Address,
  type DefaultValues,
  type RecordToJS,
} from '~types/index.ts';
import { type DecisionDraft } from '~utils/decisions.ts';

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
