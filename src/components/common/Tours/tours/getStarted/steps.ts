import { type Step } from 'react-joyride';

import { formatText } from '~utils/intl.ts';

import { GetStartedTourTargets } from './enums.ts';
import messages from './messages.ts';

export const getStartedTourSteps: Step[] = [
  {
    target: `[data-tour="${GetStartedTourTargets.WelcomeButton}"]`,
    content: formatText({
      id: 'getStarted.welcome',
      defaultMessage: messages.welcome,
    }),
  },
  {
    target: `[data-tour="${GetStartedTourTargets.EnterTitleField}"]`,
    content: formatText({
      id: 'getStarted.enterTitle',
      defaultMessage: messages.enterTitle,
    }),
  },
  {
    target: `[data-tour="${GetStartedTourTargets.ChooseActionButton}"]`,
    content: formatText({
      id: 'getStarted.chooseAction',
      defaultMessage: messages.chooseAction,
    }),
  },
  {
    target: `[data-tour="${GetStartedTourTargets.SelectActionButton}"]`,
    content: formatText({
      id: 'getStarted.selectAction',
      defaultMessage: messages.selectAction,
    }),
  },
  {
    target: `[data-tour="${GetStartedTourTargets.CustomizeColonyFields}"]`,
    content: formatText({
      id: 'getStarted.customizeColony',
      defaultMessage: messages.customizeColony,
    }),
  },
  {
    target: `[data-tour="${GetStartedTourTargets.SelectLogoField}"]`,
    content: formatText({
      id: 'getStarted.selectLogo',
      defaultMessage: messages.selectLogo,
    }),
  },
  {
    target: `[data-tour="${GetStartedTourTargets.EnterDescriptionField}"]`,
    content: formatText({
      id: 'getStarted.enterDescription',
      defaultMessage: messages.enterDescription,
    }),
  },
  {
    target: `[data-tour="${GetStartedTourTargets.SelectDecisionMethod}"]`,
    content: formatText({
      id: 'getStarted.selectDecisionMethod',
      defaultMessage: messages.selectDecisionMethod,
    }),
  },
  {
    target: `[data-tour="${GetStartedTourTargets.ConfirmActionButton}"]`,
    content: formatText({
      id: 'getStarted.confirmAction',
      defaultMessage: messages.confirmAction,
    }),
  },
];
