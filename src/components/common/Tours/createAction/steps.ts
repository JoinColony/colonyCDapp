import { FilePlus } from '@phosphor-icons/react';
import { type Step } from 'react-joyride';

import { TourTriggerIdentifier } from '~constants/tourTriggers.ts';
import CreateAProfileBanner from '~images/assets/landing/create-profile-banner.png';

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
      triggerIdentifier: TourTriggerIdentifier.OpenActionSidebar,
      nextButtonText: messages.takeTourButton,
      skipButtonText: messages.skipButton,
    },
    title: messages.introTitle,
    content: messages.introDesc,
  },
  {
    target: `[data-tour="${TourTargets.ActionsPanel}"]`,
    placement: 'left',
    content: messages.creatingActions,
  },
  {
    target: `[data-tour="${TourTargets.EnterTitleField}"]`,
    content: messages.enterTitle,
  },
  {
    target: `[data-tour="${TourTargets.ChooseActionButton}"]`,
    content: messages.chooseAction,
  },
  {
    target: `[data-tour="${TourTargets.SelectActionButton}"]`,
    content: messages.selectAction,
  },
  {
    target: `[data-tour="${TourTargets.CreateSimplePayment}"]`,
    content: messages.createSimplePayment,
  },
  {
    target: `[data-tour="${TourTargets.ActionOverviewSection}"]`,
    content: messages.actionOverview,
  },
  {
    target: `[data-tour="${TourTargets.CompleteDetailsSection}"]`,
    content: messages.completeDetails,
  },
  {
    target: `[data-tour="${TourTargets.DecisionMethodField}"]`,
    content: messages.decisionMethod,
  },
  {
    target: `[data-tour="${TourTargets.ActionDescriptionField}"]`,
    content: messages.actionDescription,
  },
  {
    target: `[data-tour="${TourTargets.CancelActionButton}"]`,
    content: messages.cancelAction,
  },
  {
    target: `[data-tour="${TourTargets.CreateActionButton}"]`,
    content: messages.createAction,
  },
];
