import { type Step } from 'react-joyride';

import { formatText } from '~utils/intl.ts';

import { CreateActionTourTargets } from './enums.ts';
import messages from './messages.tsx';

export const createActionTourSteps: Step[] = [
  {
    target: `[data-tour="${CreateActionTourTargets.CreatingActionsPanel}"]`,
    content: formatText({
      id: 'createAction.creatingActions',
      defaultMessage: messages.creatingActions,
    }),
  },
  {
    target: `[data-tour="${CreateActionTourTargets.EnterTitleField}"]`,
    content: formatText({
      id: 'createAction.enterTitle',
      defaultMessage: messages.enterTitle,
    }),
  },
  {
    target: `[data-tour="${CreateActionTourTargets.ChooseActionButton}"]`,
    content: formatText({
      id: 'createAction.chooseAction',
      defaultMessage: messages.chooseAction,
    }),
  },
  {
    target: `[data-tour="${CreateActionTourTargets.SelectActionButton}"]`,
    content: formatText({
      id: 'createAction.selectAction',
      defaultMessage: messages.selectAction,
    }),
  },
  {
    target: `[data-tour="${CreateActionTourTargets.CreateSimplePaymentButton}"]`,
    content: formatText({
      id: 'createAction.createSimplePayment',
      defaultMessage: messages.createSimplePayment,
    }),
  },
  {
    target: `[data-tour="${CreateActionTourTargets.ActionOverviewSection}"]`,
    content: formatText({
      id: 'createAction.actionOverview',
      defaultMessage: messages.actionOverview,
    }),
  },
  {
    target: `[data-tour="${CreateActionTourTargets.CompleteDetailsSection}"]`,
    content: formatText({
      id: 'createAction.completeDetails',
      defaultMessage: messages.completeDetails,
    }),
  },
  {
    target: `[data-tour="${CreateActionTourTargets.DecisionMethodField}"]`,
    content: formatText({
      id: 'createAction.decisionMethod',
      defaultMessage: messages.decisionMethod,
    }),
  },
  {
    target: `[data-tour="${CreateActionTourTargets.ActionDescriptionField}"]`,
    content: formatText({
      id: 'createAction.actionDescription',
      defaultMessage: messages.actionDescription,
    }),
  },
  {
    target: `[data-tour="${CreateActionTourTargets.CancelActionButton}"]`,
    content: formatText({
      id: 'createAction.cancelAction',
      defaultMessage: messages.cancelAction,
    }),
  },
  {
    target: `[data-tour="${CreateActionTourTargets.CreateActionButton}"]`,
    content: formatText({
      id: 'createAction.createAction',
      defaultMessage: messages.createAction,
    }),
  },
];
