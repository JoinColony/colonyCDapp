import { Record } from 'immutable';
import { Id } from '@colony/colony-js';

import { Decision as DecisionProps, DefaultValues, RecordToJS } from '~types';

const defaultValues: DefaultValues<DecisionProps> = {
  description: undefined,
  walletAddress: undefined,
  motionDomainId: Id.RootDomain,
  title: undefined,
};

export class DecisionRecord
  extends Record<DecisionProps>(defaultValues)
  implements RecordToJS<DecisionProps> {}

export const Decision = (p?: DecisionProps) => new DecisionRecord(p);
