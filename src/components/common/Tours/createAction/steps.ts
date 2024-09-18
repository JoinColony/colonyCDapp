import { TourTriggerIdentifier } from '~constants/tourTriggers.ts';
import { type TourStep } from '~context/TourContext/TourContextProvider.tsx';
import { formatText } from '~utils/intl.ts';

import { ActionTourTargets } from '../enums.ts';

import messages from './messages.tsx';

export const CreateActionTourSteps: TourStep[] = [
  {
    target: ActionTourTargets.NoTarget,
    placement: 'center',
    disableBeacon: true,
    disableOverlay: false,
    spotlightClicks: false,
    content: formatText({
      id: 'createAction.creatingActions',
      defaultMessage: messages.creatingActions,
    }),
    triggerIdentifier: TourTriggerIdentifier.openActionSidebar,
  },
  {
    target: `[data-tour="${ActionTourTargets.ActionsPanel}"]`,
    placement: 'left',
    content: formatText({
      id: 'createAction.creatingActions',
      defaultMessage: messages.creatingActions,
    }),
  },
  {
    target: `[data-tour="${ActionTourTargets.EnterTitleField}"]`,
    content: formatText({
      id: 'createAction.enterTitle',
      defaultMessage: messages.enterTitle,
    }),
  },
  {
    target: `[data-tour="${ActionTourTargets.ChooseActionButton}"]`,
    content: formatText({
      id: 'createAction.chooseAction',
      defaultMessage: messages.chooseAction,
    }),
  },
  {
    target: `[data-tour="${ActionTourTargets.SelectActionButton}"]`,
    content: formatText({
      id: 'createAction.selectAction',
      defaultMessage: messages.selectAction,
    }),
  },
  {
    target: `[data-tour="${ActionTourTargets.CreateSimplePayment}"]`,
    content: formatText({
      id: 'createAction.createSimplePayment',
      defaultMessage: messages.createSimplePayment,
    }),
  },
  {
    target: `[data-tour="${ActionTourTargets.ActionOverviewSection}"]`,
    content: formatText({
      id: 'createAction.actionOverview',
      defaultMessage: messages.actionOverview,
    }),
  },
  {
    target: `[data-tour="${ActionTourTargets.CompleteDetailsSection}"]`,
    content: formatText({
      id: 'createAction.completeDetails',
      defaultMessage: messages.completeDetails,
    }),
  },
  {
    target: `[data-tour="${ActionTourTargets.DecisionMethodField}"]`,
    content: formatText({
      id: 'createAction.decisionMethod',
      defaultMessage: messages.decisionMethod,
    }),
  },
  {
    target: `[data-tour="${ActionTourTargets.ActionDescriptionField}"]`,
    content: formatText({
      id: 'createAction.actionDescription',
      defaultMessage: messages.actionDescription,
    }),
  },
  {
    target: `[data-tour="${ActionTourTargets.CancelActionButton}"]`,
    content: formatText({
      id: 'createAction.cancelAction',
      defaultMessage: messages.cancelAction,
    }),
  },
  {
    target: `[data-tour="${ActionTourTargets.CreateActionButton}"]`,
    content: formatText({
      id: 'createAction.createAction',
      defaultMessage: messages.createAction,
    }),
  },
];
