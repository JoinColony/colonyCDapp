import { defineMessages } from 'react-intl';

import { ActionTitleKey, registerAction } from '~actions/index.ts';
import CreateDecisionForm from '~v5/common/ActionSidebar/partials/forms/core/CreateDecisionForm/CreateDecisionForm.tsx';

import { CoreAction } from './types.ts';

const MSG = defineMessages({
  name: {
    id: 'actions.core.CreateDecisionMotion.name',
    defaultMessage: 'Create agreement',
  },
  title: {
    id: 'actions.core.CreateDecisionMotion.title',
    defaultMessage: 'New agreement by {initiator}',
  },
});

registerAction({
  component: CreateDecisionForm,
  name: MSG.name,
  title: MSG.title,
  titleKeys: [ActionTitleKey.Initiator],
  type: CoreAction.CreateDecisionMotion,
});
