import { type Step } from 'react-joyride';

import { formatText } from '~utils/intl.ts';

import { TourTargets } from '../enums.ts';

import messages from './messages.tsx';

export const GetStartedTourSteps: Step[] = [
  {
    target: `[data-tour="${TourTargets.WelcomeButton}"]`,
    content: formatText({
      id: 'getStartedTour.welcome',
      defaultMessage: messages.welcome,
    }),
  },
  {
    target: `[data-tour="${TourTargets.EnterTitleField}"]`,
    content: formatText({
      id: 'getStartedTour.enterTitle',
      defaultMessage: messages.enterTitle,
    }),
  },
  {
    target: `[data-tour="${TourTargets.ChooseActionButton}"]`,
    content: formatText({
      id: 'getStartedTour.chooseAction',
      defaultMessage: messages.chooseAction,
    }),
  },
  {
    target: `[data-tour="${TourTargets.SelectActionButton}"]`,
    content: formatText({
      id: 'getStartedTour.selectAction',
      defaultMessage: messages.selectAction,
    }),
  },
  {
    target: `[data-tour="${TourTargets.CustomizeColonyFields}"]`,
    content: formatText({
      id: 'getStartedTour.customizeColony',
      defaultMessage: messages.customizeColony,
    }),
  },
  {
    target: `[data-tour="${TourTargets.SelectLogoField}"]`,
    content: formatText({
      id: 'getStartedTour.selectLogo',
      defaultMessage: messages.selectLogo,
    }),
  },
  {
    target: `[data-tour="${TourTargets.EnterDescriptionField}"]`,
    content: formatText({
      id: 'getStartedTour.enterDescription',
      defaultMessage: messages.enterDescription,
    }),
  },
  {
    target: `[data-tour="${TourTargets.SelectDecisionMethod}"]`,
    content: formatText({
      id: 'getStartedTour.selectDecisionMethod',
      defaultMessage: messages.selectDecisionMethod,
    }),
  },
  {
    target: `[data-tour="${TourTargets.ConfirmActionButton}"]`,
    content: formatText({
      id: 'getStartedTour.confirmAction',
      defaultMessage: messages.confirmAction,
    }),
  },
];
