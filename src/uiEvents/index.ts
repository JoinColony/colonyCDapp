import { AnalyticsBrowser } from '@segment/analytics-next';

export const uiEvents = new AnalyticsBrowser();

export enum UIEvent {
  manageAccount = 'User Managed Account',
  createAccount = 'User Created Account',
  updateAvatar = 'User Updated Avatar',
  updateProfile = 'User Updated Profile',
  userJoinedColony = 'User Joined Colony',
  colonySwitcher = 'User Opened Colony Switcher',
  openDashboardMenu = 'User Opened Dashboard Menu',
  viewPage = 'User Viewed Page',
  openFinanceMenu = 'User Opened Finance Menu',
  openAdminMenu = 'User Opened Admin Menu',
  relatedAction = 'User Clicked Related Action',
  giveFeedback = 'User Gave Feedback',
  openTeamsMenu = 'User Opened Teams Menu',
  selectTeam = 'User Selected Team',
  actionSidebarOpened = 'User Openeded Action Sidebar',
  actionCreated = 'User Created Action',
  actionCreationSucceeded = 'User Action Creation Succeeded',
}
