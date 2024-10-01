import { registerAction } from '~actions/utils.ts';
import CreateDecisionForm from '~v5/common/ActionSidebar/partials/forms/core/CreateDecisionForm/CreateDecisionForm.tsx';

import { CoreAction } from './types.ts';

registerAction({
  component: CreateDecisionForm,
  name: {
    id: 'actions.core.createDecision',
    defaultMessage: 'Create agreement',
  },
  type: CoreAction.CreateDecisionMotion,
});
