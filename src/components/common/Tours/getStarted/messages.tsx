import { intl } from '~utils/intl.ts';

const { formatMessage } = intl({
  'getStarted.welcome':
    'Welcome! Click this button to start setting up your colony.',
  'getStarted.enterTitle':
    'Enter a title for the action, e.g., "Setting up details".',
  'getStarted.chooseAction': 'You can then choose the action you want to take.',
  'getStarted.selectAction': `Click on "Edit colony details" to customize your colony's details.`,
  'getStarted.customizeColony':
    'Begin editing the fields to customize your colony.',
  'getStarted.selectLogo': 'Click to upload a logo for your colony.',
  'getStarted.enterDescription':
    'Briefly describe the purpose and what your colony is about.',
  'getStarted.selectDecisionMethod':
    'Choose a decision method. Permissions are available now.',
  'getStarted.confirmAction':
    'Click to confirm and update the details for your colony.',
});

export const getStartedMessages = {
  welcome: formatMessage({ id: 'getStarted.welcome' }),
  enterTitle: formatMessage({ id: 'getStarted.enterTitle' }),
  chooseAction: formatMessage({ id: 'getStarted.chooseAction' }),
  selectAction: formatMessage({ id: 'getStarted.selectAction' }),
  customizeColony: formatMessage({ id: 'getStarted.customizeColony' }),
  selectLogo: formatMessage({ id: 'getStarted.selectLogo' }),
  enterDescription: formatMessage({ id: 'getStarted.enterDescription' }),
  selectDecisionMethod: formatMessage({
    id: 'getStarted.selectDecisionMethod',
  }),
  confirmAction: formatMessage({ id: 'getStarted.confirmAction' }),
};

export default getStartedMessages;
