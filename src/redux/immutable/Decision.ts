import { Record } from 'immutable';
import { Id } from '@colony/colony-js';

import { DefaultValues, RecordToJS } from '~types';
import { DecisionDialogValues as DecisionProps } from '~common/ColonyDecisions/DecisionDialog';

const defaultValues: DefaultValues<DecisionProps & { colonyAddress: string }> =
  {
    description: undefined,
    walletAddress: undefined,
    motionDomainId: Id.RootDomain,
    title: undefined,
    colonyAddress: undefined,
  };

export class DecisionRecord
  extends Record<DecisionProps>(defaultValues)
  implements RecordToJS<DecisionProps> {}

export const Decision = (p?: DecisionProps) => new DecisionRecord(p);
