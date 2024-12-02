import { type Step } from 'react-joyride';

import { TourTargets } from '../enums.ts';

import messages from './messages.tsx';

export const GetStartedTourSteps: Step[] = [
  {
    target: `[data-tour="${TourTargets.WelcomeButton}"]`,
    content: messages.welcome,
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
    target: `[data-tour="${TourTargets.CustomizeColonyFields}"]`,
    content: messages.customizeColony,
  },
  {
    target: `[data-tour="${TourTargets.SelectLogoField}"]`,
    content: messages.selectLogo,
  },
  {
    target: `[data-tour="${TourTargets.EnterDescriptionField}"]`,
    content: messages.enterDescription,
  },
  {
    target: `[data-tour="${TourTargets.SelectDecisionMethod}"]`,
    content: messages.selectDecisionMethod,
  },
  {
    target: `[data-tour="${TourTargets.ConfirmActionButton}"]`,
    content: messages.confirmAction,
  },
];
