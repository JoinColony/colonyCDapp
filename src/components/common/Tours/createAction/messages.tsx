import { intl } from '~utils/intl.ts';

const { formatMessage } = intl({
  'createAction.introTitle': 'Creating actions',
  'createAction.introDesc':
    'Learn how to create actions like payments, transfers, and more.',
  'createAction.takeTourButton': 'Take a quick tour',
  'createAction.skipButton': 'Skip for now',
  'createAction.creatingActions':
    'The action panel lets you perform actions like payments, transfers, and more.',
  'createAction.enterTitle':
    'Enter a custom title for the action, e.g., "Payment for project work".',
  'createAction.chooseAction':
    'Click on "Choose action type" to select the action you want to take.',
  'createAction.selectAction': 'Search or click to select the type of action.',
  'createAction.createSimplePayment':
    'Click to create a Simple Payment action.',
  'createAction.actionOverview': 'This provides a summary of the action.',
  'createAction.completeDetails':
    'Hover over labels for explanations, then enter details on the left.',
  'createAction.decisionMethod':
    'Select the method for deciding if the action should be taken.',
  'createAction.actionDescription':
    'Click "Description" to add context to the action.',
  'createAction.cancelAction':
    'You can cancel or click out to close the action panel.',
  'createAction.createAction':
    'Click to create the action and approve in your wallet.',
});

export const createActionMessages = {
  introTitle: formatMessage({ id: 'createAction.introTitle' }),
  introDesc: formatMessage({ id: 'createAction.introDesc' }),
  takeTourButton: formatMessage({ id: 'usingApp.takeTourButton' }),
  skipButton: formatMessage({ id: 'usingApp.skipButton' }),
  creatingActions: formatMessage({ id: 'createAction.creatingActions' }),
  enterTitle: formatMessage({ id: 'createAction.enterTitle' }),
  chooseAction: formatMessage({ id: 'createAction.chooseAction' }),
  selectAction: formatMessage({ id: 'createAction.selectAction' }),
  createSimplePayment: formatMessage({
    id: 'createAction.createSimplePayment',
  }),
  actionOverview: formatMessage({ id: 'createAction.actionOverview' }),
  completeDetails: formatMessage({ id: 'createAction.completeDetails' }),
  decisionMethod: formatMessage({ id: 'createAction.decisionMethod' }),
  actionDescription: formatMessage({ id: 'createAction.actionDescription' }),
  cancelAction: formatMessage({ id: 'createAction.cancelAction' }),
  createAction: formatMessage({ id: 'createAction.createAction' }),
};

export default createActionMessages;
