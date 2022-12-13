import React from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~shared/Heading';
import { User } from '~types';

import UserAvatarUploader from './UserAvatarUploader';

const displayName = 'common.UserProfileEdit.Sidebar';

const MSG = defineMessages({
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: 'Profile Picture',
  },
});

interface Props {
  user: User;
}

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
