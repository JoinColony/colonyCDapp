import React from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~shared/Heading';
import { User } from '~types';

import UserAvatarUploader from './UserAvatarUploader';

const MSG = defineMessages({
  heading: {
    id: 'users.UserProfileEdit.Sidebar.heading',
    defaultMessage: 'Profile Picture',
  },
});

interface Props {
  user: User;
}

const displayName = 'common.UserProfileEdit.Sidebar';

const Sidebar = ({ user }: Props) => (
  <>
    <Heading
      appearance={{ theme: 'dark', size: 'medium' }}
      text={MSG.heading}
    />
    <UserAvatarUploader user={user} />
  </>
);

Sidebar.displayName = displayName;

export default Sidebar;
