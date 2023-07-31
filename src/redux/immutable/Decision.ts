import { Record } from 'immutable';
import { Id } from '@colony/colony-js';

import {
  ColonyDecision as DecisionProps,
  DefaultValues,
  RecordToJS,
} from '~types';

const defaultValues: DefaultValues<Omit<DecisionProps, '__typename'>> = {
  description: undefined,
  walletAddress: undefined,
  motionDomainId: Id.RootDomain,
  title: undefined,
};

export class DecisionRecord
  extends Record<DecisionProps>(defaultValues)
  implements RecordToJS<DecisionProps> {}

export const Decision = (p?: DecisionProps) => new DecisionRecord(p);
