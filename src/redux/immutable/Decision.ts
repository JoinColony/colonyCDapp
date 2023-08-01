import { Record } from 'immutable';
import { Id } from '@colony/colony-js';

import { ColonyDecision, DefaultValues, RecordToJS } from '~types';

type DecisionProps = Omit<ColonyDecision, '__typename' | 'createdAt'>;

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
