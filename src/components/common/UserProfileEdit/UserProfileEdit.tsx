import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Tab, TabList, TabPanel, Tabs } from '~shared/Tabs';

import ProfileTemplate from '~frame/ProfileTemplate';
import LandingPage from '~frame/LandingPage';

import UserProfileSpinner from '../UserProfile/UserProfileSpinner';
import Sidebar from './Sidebar';
import UserMainSettings from './UserMainSettings';
import UserAdvanceSettings from './UserAdvanceSettings';
import { useAppContext } from '~hooks';

const displayName = 'common.UserProfileEdit';

const MSG = defineMessages({
  headingMain: {
    id: `${displayName}.headingMain`,
    defaultMessage: 'User profile',
  },
  headingAdvance: {
    id: `${displayName}.headingAdvance`,
    defaultMessage: 'Advanced settings',
  },
});

const UserProfileEdit = () => {
  const { user, userLoading } = useAppContext();

  if (userLoading) {
    return <UserProfileSpinner />;
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <ProfileTemplate
      appearance={{ theme: 'alt' }}
      asideContent={<Sidebar user={user} />}
    >
      <Tabs>
        <TabList>
          <Tab>
            <FormattedMessage {...MSG.headingMain} />
          </Tab>
          <Tab>
            <FormattedMessage {...MSG.headingAdvance} />
          </Tab>
        </TabList>
        <TabPanel>
          <UserMainSettings user={user} />
        </TabPanel>
        <TabPanel>
          <UserAdvanceSettings />
        </TabPanel>
      </Tabs>
    </ProfileTemplate>
  );
};

UserProfileEdit.displayName = displayName;

export default UserProfileEdit;
