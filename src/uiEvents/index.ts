import { AnalyticsBrowser } from '@segment/analytics-next';

export const uiEvents = new AnalyticsBrowser();

export enum UIEvent {
  manageAccount = 'Manage Account',
  createAccount = 'Create Account',
}
