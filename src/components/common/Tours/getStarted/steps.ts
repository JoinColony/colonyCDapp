import { type Step } from 'react-joyride';

import { formatText } from '~utils/intl.ts';

import { ActionTourTargets } from '../enums.ts';

import messages from './messages.tsx';

export const GetStartedTourSteps: Step[] = [
  {
    target: `[data-tour="${ActionTourTargets.WelcomeButton}"]`,
    content: formatText({
      id: 'getStarted.welcome',
      defaultMessage: messages.welcome,
    }),
  },
  {
    target: `[data-tour="${ActionTourTargets.EnterTitleField}"]`,
    content: formatText({
      id: 'getStarted.enterTitle',
      defaultMessage: messages.enterTitle,
    }),
  },
  {
    target: `[data-tour="${ActionTourTargets.ChooseActionButton}"]`,
    content: formatText({
      id: 'getStarted.chooseAction',
      defaultMessage: messages.chooseAction,
    }),
  },
  {
    target: `[data-tour="${ActionTourTargets.SelectActionButton}"]`,
    content: formatText({
      id: 'getStarted.selectAction',
      defaultMessage: messages.selectAction,
    }),
  },
  {
    target: `[data-tour="${ActionTourTargets.CustomizeColonyFields}"]`,
    content: formatText({
      id: 'getStarted.customizeColony',
      defaultMessage: messages.customizeColony,
    }),
  },
  {
    target: `[data-tour="${ActionTourTargets.SelectLogoField}"]`,
    content: formatText({
      id: 'getStarted.selectLogo',
      defaultMessage: messages.selectLogo,
    }),
  },
  {
    target: `[data-tour="${ActionTourTargets.EnterDescriptionField}"]`,
    content: formatText({
      id: 'getStarted.enterDescription',
      defaultMessage: messages.enterDescription,
    }),
  },
  {
    target: `[data-tour="${ActionTourTargets.SelectDecisionMethod}"]`,
    content: formatText({
      id: 'getStarted.selectDecisionMethod',
      defaultMessage: messages.selectDecisionMethod,
    }),
  },
  {
    target: `[data-tour="${ActionTourTargets.ConfirmActionButton}"]`,
    content: formatText({
      id: 'getStarted.confirmAction',
      defaultMessage: messages.confirmAction,
    }),
  },
];
