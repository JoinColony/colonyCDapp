import { AnalyticsBrowser as Segment } from '@segment/analytics-next';

const UIEVENTS_ENDPOINT = new URL(
  `${process.env.AUTH_PROXY_ENDPOINT || 'http://localhost:3005'}/ui-events`,
);

export enum UIEvent {
  manageAccount = 'User Managed Account',
  createAccount = 'User Created Account',
  updateAvatar = 'User Updated Avatar',
  updateProfile = 'User Updated Profile',
  userJoinedColony = 'User Joined Colony',
  colonySwitcher = 'User Opened Colony Switcher',
  viewPage = 'User Viewed Page',
  openMenu = 'User Opened Menu',
  relatedAction = 'User Clicked Related Action',
  giveFeedback = 'User Gave Feedback',
  openTeamsMenu = 'User Opened Teams Menu',
  selectTeam = 'User Selected Team',
  actionSidebarOpened = 'User Openeded Action Sidebar',
  actionCreated = 'User Created Action',
  actionCreationSucceeded = 'User Action Creation Succeeded',
}

class UIEvents extends Segment {
  load() {
    return super.load(
      {
        writeKey: '',
        cdnURL: UIEVENTS_ENDPOINT.href,
      },
      {
        disableClientPersistence: true,
        integrations: {
          'Segment.io': {
            apiHost: `${UIEVENTS_ENDPOINT.host}${UIEVENTS_ENDPOINT.pathname}`,
            protocol: UIEVENTS_ENDPOINT.protocol.replace(':', ''),
          },
        },
      },
    );
  }

  user = this.identify.bind(this);

  colony = this.group.bind(this);

  emit = this.track.bind(this);
}

export const uiEvents = new UIEvents();
