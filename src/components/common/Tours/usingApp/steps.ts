import { type Step } from 'react-joyride';

import AppTourStart from '~images/assets/tour/app-tour-start.jpg';
import { formatText } from '~utils/intl.ts';

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
      nextButtonText: formatText({
        id: 'usingAppTour.TakeATour',
        defaultMessage: 'Take a quick tour',
      }),
      skipButtonText: formatText({
        id: 'usingAppTour.skipForNow',
        defaultMessage: 'Skip for now',
      }),
    },
    title: formatText({
      id: 'usingAppTour.introTitle',
      defaultMessage: messages.introTitle,
    }),
    content: formatText({
      id: 'usingAppTour.introDesc',
      defaultMessage: messages.introDesc,
    }),
  },
  {
    target: `[data-tour="${TourTargets.MainMenu}"]`,
    placement: 'right',
    title: formatText({
      id: 'usingAppTour.actionsAndNavigationTitle',
      defaultMessage: messages.actionsAndNavigationTitle,
    }),
    content: formatText({
      id: 'usingAppTour.actionsAndNavigation',
      defaultMessage: messages.actionsAndNavigation,
    }),
  },
  {
    target: `[data-tour="${TourTargets.ActionsMenu}"]`,
    placement: 'bottom',
    title: formatText({
      id: 'usingAppTour.actionsItemTitle',
      defaultMessage: messages.actionsItemTitle,
    }),
    content: formatText({
      id: 'usingAppTour.actionsItems',
      defaultMessage: messages.actionsItems,
    }),
  },
  {
    target: `[data-tour="${TourTargets.HelpAndFeedback}"]`,
    placement: 'top',
    title: formatText({
      id: 'usingAppTour.helpAndFeedbackTitle',
      defaultMessage: messages.helpAndFeedbackTitle,
    }),
    content: formatText({
      id: 'usingAppTour.helpAndFeedback',
      defaultMessage: messages.helpAndFeedback,
    }),
  },
  {
    target: `[data-tour="${TourTargets.UserMenu}"]`,
    placement: 'bottom',
    title: formatText({
      id: 'usingAppTour.yourDetailsTitle',
      defaultMessage: messages.yourDetailsTitle,
    }),
    content: formatText({
      id: 'usingAppTour.yourDetails',
      defaultMessage: messages.yourDetails,
    }),
  },
  {
    target: `[data-tour="${TourTargets.Dashboard}"]`,
    placement: 'bottom',
    title: formatText({
      id: 'usingAppTour.dashboardOverviewTitle',
      defaultMessage: messages.dashboardOverviewTitle,
    }),
    content: formatText({
      id: 'usingAppTour.dashboardOverview',
      defaultMessage: messages.dashboardOverview,
    }),
  },
  {
    target: TourTargets.NoTarget,
    placement: 'center',
    disableBeacon: true,
    disableOverlay: false,
    spotlightClicks: false,
    title: formatText({
      id: 'usingAppTour.nextStepsTitle',
      defaultMessage: messages.nextStepsTitle,
    }),
    content: formatText({
      id: 'usingAppTour.nextSteps',
      defaultMessage: messages.nextSteps,
    }),
  },
];
