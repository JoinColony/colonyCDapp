import { Id } from '@colony/colony-js';
import { Record } from 'immutable';

import { DecisionDialogValues as DecisionProps } from '~common/ColonyDecisions/DecisionDialog';
import { DefaultValues, RecordToJS } from '~types';

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
