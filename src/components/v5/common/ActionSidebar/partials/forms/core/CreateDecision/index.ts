import { ColonyRole } from '@colony/colony-js';

import CreateDecision from './CreateDecision.tsx';

const formDefinition = {
  component: CreateDecision,
  name: {
    id: 'actions.core.createDecision',
    defaultMessage: 'Create agreement',
  },
  neededPermissions: [ColonyRole.Funding, ColonyRole.Administration],
  permissionDomainId: ({ watch }) => watch('from'),
};

export default formDefinition;
