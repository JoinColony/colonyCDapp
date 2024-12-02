import { type Step } from 'react-joyride';

import AppTourStart from '~images/assets/tour/app-tour-start.jpg';

import { TourTargets } from '../enums.ts';

import messages from './messages.tsx';

export const UsingTheAppTourSteps: Step[] = [
  {
    target: TourTargets.NoTarget,
    placement: 'center',
    disableBeacon: true,
    disableOverlay: false,
    spotlightClicks: false,
    data: {
      image: AppTourStart,
      nextButtonText: messages.takeTourButton,
      skipButtonText: messages.skipButton,
    },
    title: messages.introTitle,
    content: messages.introDesc,
  },
  {
    target: `[data-tour="${TourTargets.MainMenu}"]`,
    placement: 'right',
    title: messages.actionsAndNavigationTitle,
    content: messages.actionsAndNavigation,
  },
  {
    target: `[data-tour="${TourTargets.ActionsMenu}"]`,
    placement: 'bottom',
    title: messages.actionsItemTitle,
    content: messages.actionsItems,
  },
  {
    target: `[data-tour="${TourTargets.HelpAndFeedback}"]`,
    placement: 'top',
    title: messages.helpAndFeedbackTitle,
    content: messages.helpAndFeedback,
  },
  {
    target: `[data-tour="${TourTargets.UserMenu}"]`,
    placement: 'bottom',
    title: messages.yourDetailsTitle,
    content: messages.yourDetails,
  },
  {
    target: `[data-tour="${TourTargets.Dashboard}"]`,
    placement: 'bottom',
    title: messages.dashboardOverviewTitle,
    content: messages.dashboardOverview,
  },
  {
    target: TourTargets.NoTarget,
    placement: 'center',
    disableBeacon: true,
    disableOverlay: false,
    spotlightClicks: false,
    title: messages.nextStepsTitle,
    content: messages.nextSteps,
    data: {
      nextButtonText: messages.finishTourButton,
    },
  },
];
