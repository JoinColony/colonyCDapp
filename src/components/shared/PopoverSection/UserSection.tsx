import React from 'react';
import { defineMessages } from 'react-intl';

import { useAppContext, useUserAccountRegistered } from '~hooks';
import {
  CREATE_PROFILE_ROUTE,
  USER_HOME_ROUTE,
  USER_EDIT_PROFILE_ROUTE,
} from '~routes/routeConstants';
import { DropdownMenuItem, DropdownMenuSection } from '~shared/DropdownMenu';
import NavLink from '~shared/NavLink';

const displayName = 'PopoverSection.UserSection';

const MSG = defineMessages({
  buttonGetStarted: {
    id: `${displayName}.buttonGetStarted`,
    defaultMessage: 'Get started',
  },
  myProfile: {
    id: `${displayName}.myProfile`,
    defaultMessage: 'My Profile',
  },
  settings: {
    id: `${displayName}.settings`,
    defaultMessage: 'Settings',
  },
  wallet: {
    id: `${displayName}.wallet`,
    defaultMessage: 'Wallet',
  },
});

const UserSection = () => {
  const { user } = useAppContext();
  const userHasAccountRegistered = useUserAccountRegistered();

  return (
    <DropdownMenuSection separator>
      {userHasAccountRegistered ? (
        <>
          <DropdownMenuItem>
            <NavLink
              to={`/user/${user?.profile?.displayName}`}
              text={MSG.myProfile}
              data-test="userProfile"
            />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <NavLink
              to={`${USER_HOME_ROUTE}/${USER_EDIT_PROFILE_ROUTE}`}
              text={MSG.settings}
              data-test="userProfileSettings"
            />
          </DropdownMenuItem>
        </>
      ) : (
        <DropdownMenuItem>
          <NavLink to={CREATE_PROFILE_ROUTE} text={MSG.buttonGetStarted} />
        </DropdownMenuItem>
      )}
    </DropdownMenuSection>
  );
};

UserSection.displayName = displayName;

export default UserSection;
