import React from 'react';
import { defineMessages } from 'react-intl';

import { DropdownMenuItem, DropdownMenuSection } from '~shared/DropdownMenu';
import NavLink from '~shared/NavLink';
import {
  CREATE_USER_ROUTE,
  USER_EDIT_ROUTE,
  // WALLET_ROUTE,
} from '~routes/routeConstants';
import { useAppContext, useColonyContext } from '~hooks';

const MSG = defineMessages({
  buttonGetStarted: {
    id: 'users.PopoverSection.UserSection.buttonGetStarted',
    defaultMessage: 'Get started',
  },
  myProfile: {
    id: 'users.PopoverSection.UserSection.link.myProfile',
    defaultMessage: 'My Profile',
  },
  settings: {
    id: 'users.PopoverSection.UserSection.link.settings',
    defaultMessage: 'Settings',
  },
  wallet: {
    id: 'users.PopoverSection.UserSection.link.wallet',
    defaultMessage: 'Wallet',
  },
});

const displayName = 'users.PopoverSection.UserSection';

const UserSection = () => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();

  return (
    <DropdownMenuSection separator>
      {!user?.name && (
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
      {user?.name && (
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
          {/* <DropdownMenuItem>
            <NavLink to={WALLET_ROUTE} text={MSG.wallet} />
          </DropdownMenuItem> */}
        </>
      )}
    </DropdownMenuSection>
  );
};

UserSection.displayName = displayName;

export default UserSection;
