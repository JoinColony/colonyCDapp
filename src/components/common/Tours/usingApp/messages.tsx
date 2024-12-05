import { intl } from '~utils/intl.ts';

const { formatMessage } = intl({
  'usingApp.introTitle': 'Using Colony',
  'usingApp.introDesc':
    'Learn how to use Colony and find your way around the app.',
  'usingApp.takeTourButton': 'Take a quick tour',
  'usingApp.skipButton': 'Skip for now',
  'usingApp.actionsAndNavigationTitle': 'Actions and Navigation',
  'usingApp.actionsAndNavigation':
    'Create actions and navigate throughout the app using the main menu.',
  'usingApp.actionsItemTitle': 'Creating actions',
  'usingApp.actionsItems':
    'Easily perform actions like making payments, creating teams, transferring funds, and more.',
  'usingApp.helpAndFeedbackTitle': 'Help & Feedback',
  'usingApp.helpAndFeedback':
    'Need assistance or have feedback? Start here for guidance and support options.',
  'usingApp.yourDetailsTitle': 'Your Details',
  'usingApp.yourDetails':
    'View your account details, balance, transaction history, and manage your settings.',
  'usingApp.dashboardOverviewTitle': 'The Dashboard',
  'usingApp.dashboardOverview':
    'Get a quick view of essential information on the dashboard. Use filters or click on elements for more details.',
  'usingApp.nextStepsTitle': 'Next Steps',
  'usingApp.nextSteps':
    'Take your time to explore. Hover over elements, click around, and feel free to reach out with any questions or feedback.',
  'usingApp.finishTourButton': 'Finish tour',
});

export const usingAppMessages = {
  introTitle: formatMessage({ id: 'usingApp.introTitle' }),
  introDesc: formatMessage({ id: 'usingApp.introDesc' }),
  takeTourButton: formatMessage({ id: 'usingApp.takeTourButton' }),
  skipButton: formatMessage({ id: 'usingApp.skipButton' }),
  actionsAndNavigationTitle: formatMessage({
    id: 'usingApp.actionsAndNavigationTitle',
  }),
  actionsAndNavigation: formatMessage({ id: 'usingApp.actionsAndNavigation' }),
  actionsItemTitle: formatMessage({ id: 'usingApp.actionsItemTitle' }),
  actionsItems: formatMessage({ id: 'usingApp.actionsItems' }),
  helpAndFeedbackTitle: formatMessage({ id: 'usingApp.helpAndFeedbackTitle' }),
  helpAndFeedback: formatMessage({ id: 'usingApp.helpAndFeedback' }),
  yourDetailsTitle: formatMessage({ id: 'usingApp.yourDetailsTitle' }),
  yourDetails: formatMessage({ id: 'usingApp.yourDetails' }),
  dashboardOverviewTitle: formatMessage({
    id: 'usingApp.dashboardOverviewTitle',
  }),
  dashboardOverview: formatMessage({ id: 'usingApp.dashboardOverview' }),
  nextStepsTitle: formatMessage({ id: 'usingApp.nextStepsTitle' }),
  nextSteps: formatMessage({ id: 'usingApp.nextSteps' }),
  finishTourButton: formatMessage({ id: 'usingApp.finishTourButton' }),
};

export default usingAppMessages;
