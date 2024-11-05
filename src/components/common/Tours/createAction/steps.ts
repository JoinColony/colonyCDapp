import { FilePlus } from '@phosphor-icons/react';
import { type Step } from 'react-joyride';

import { TourTriggerIdentifier } from '~constants/tourTriggers.ts';
import CreateAProfileBanner from '~images/assets/landing/create-profile-banner.png';
import { formatText } from '~utils/intl.ts';

import { TourTargets } from '../enums.ts';

import messages from './messages.tsx';

export const CreateActionTourSteps: Step[] = [
  {
    target: TourTargets.NoTarget,
    placement: 'center',
    disableBeacon: true,
    disableOverlay: false,
    spotlightClicks: false,
    data: {
      icon: FilePlus,
      image: CreateAProfileBanner,
      triggerIdentifier: TourTriggerIdentifier.openActionSidebar,
      nextButtonText: formatText({
        id: 'createActionTour.TakeATour',
        defaultMessage: 'Take a quick tour',
      }),
      skipButtonText: formatText({
        id: 'createActionTour.skipForNow',
        defaultMessage: 'Skip for now',
      }),
    },
    title: formatText({
      id: 'createActionTour.introTitle',
      defaultMessage: messages.introTitle,
    }),
    content: formatText({
      id: 'createActionTour.introDesc',
      defaultMessage: messages.introDesc,
    }),
  },
  {
    target: `[data-tour="${TourTargets.ActionsPanel}"]`,
    placement: 'left',
    content: formatText({
      id: 'createActionTour.creatingActions',
      defaultMessage: messages.creatingActions,
    }),
  },
  {
    target: `[data-tour="${TourTargets.EnterTitleField}"]`,
    content: formatText({
      id: 'createActionTour.enterTitle',
      defaultMessage: messages.enterTitle,
    }),
  },
  {
    target: `[data-tour="${TourTargets.ChooseActionButton}"]`,
    content: formatText({
      id: 'createActionTour.chooseAction',
      defaultMessage: messages.chooseAction,
    }),
  },
  {
    target: `[data-tour="${TourTargets.SelectActionButton}"]`,
    content: formatText({
      id: 'createActionTour.selectAction',
      defaultMessage: messages.selectAction,
    }),
  },
  {
    target: `[data-tour="${TourTargets.CreateSimplePayment}"]`,
    content: formatText({
      id: 'createActionTour.createSimplePayment',
      defaultMessage: messages.createSimplePayment,
    }),
  },
  {
    target: `[data-tour="${TourTargets.ActionOverviewSection}"]`,
    content: formatText({
      id: 'createActionTour.actionOverview',
      defaultMessage: messages.actionOverview,
    }),
  },
  {
    target: `[data-tour="${TourTargets.CompleteDetailsSection}"]`,
    content: formatText({
      id: 'createActionTour.completeDetails',
      defaultMessage: messages.completeDetails,
    }),
  },
  {
    target: `[data-tour="${TourTargets.DecisionMethodField}"]`,
    content: formatText({
      id: 'createActionTour.decisionMethod',
      defaultMessage: messages.decisionMethod,
    }),
  },
  {
    target: `[data-tour="${TourTargets.ActionDescriptionField}"]`,
    content: formatText({
      id: 'createActionTour.actionDescription',
      defaultMessage: messages.actionDescription,
    }),
  },
  {
    target: `[data-tour="${TourTargets.CancelActionButton}"]`,
    content: formatText({
      id: 'createActionTour.cancelAction',
      defaultMessage: messages.cancelAction,
    }),
  },
  {
    target: `[data-tour="${TourTargets.CreateActionButton}"]`,
    content: formatText({
      id: 'createActionTour.createActionTour',
      defaultMessage: messages.createAction,
    }),
  },
];
