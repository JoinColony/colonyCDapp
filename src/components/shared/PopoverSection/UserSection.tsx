import React from 'react';
import { defineMessages } from 'react-intl';

import { DropdownMenuItem, DropdownMenuSection } from '~shared/DropdownMenu';
import NavLink from '~shared/NavLink';
import { CREATE_USER_ROUTE, USER_EDIT_ROUTE } from '~routes/routeConstants';
import {
  useAppContext,
  useColonyContext,
  useUserAccountRegistered,
} from '~hooks';

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
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const userHasAccountRegistered = useUserAccountRegistered();

  return (
    <DropdownMenuSection separator>
      {userHasAccountRegistered ? (
        <>
          <DropdownMenuItem>
            <NavLink
              to={`/user/${user?.name}`}
              text={MSG.myProfile}
              data-test="userProfile"
            />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <NavLink
              to={USER_EDIT_ROUTE}
              text={MSG.settings}
              data-test="userProfileSettings"
            />
          </DropdownMenuItem>
        </>
      ) : (
        <DropdownMenuItem>
          <NavLink
            to={{
              pathname: CREATE_USER_ROUTE,
              state: colony?.name
                ? { colonyURL: `/colony/${colony?.name}` }
                : {},
            }}
            text={MSG.buttonGetStarted}
          />
        </DropdownMenuItem>
      )}
    </DropdownMenuSection>
  );
};

UserSection.displayName = displayName;

export default UserSection;
