import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';

import { ActionButton } from '~shared/Button';
import NavLink from '~shared/NavLink';
import ExternalLink from '~shared/ExternalLink';
import { FEEDBACK, HELP } from '~constants/externalUrls';

// import { Colony } from '~data/index';
import DropdownMenu, {
  DropdownMenuSection,
  DropdownMenuItem,
} from '~shared/DropdownMenu';
import { ActionTypes } from '~redux';
import {
  USER_EDIT_ROUTE,
  CREATE_COLONY_ROUTE,
  CREATE_USER_ROUTE,
} from '~routes/index';
import { useAppContext } from '~hooks';

import styles from './AvatarDropdownPopover.css';

const MSG = defineMessages({
  buttonGetStarted: {
    id: 'users.AvatarDropdown.AvatarDropdownPopover.buttonGetStarted',
    defaultMessage: 'Get started',
  },
  myProfile: {
    id: 'users.AvatarDropdown.AvatarDropdownPopover.link.myProfile',
    defaultMessage: 'My Profile',
  },
  settings: {
    id: 'users.AvatarDropdown.AvatarDropdownPopover.link.colonySettings',
    defaultMessage: 'Settings',
  },
  createColony: {
    id: 'users.AvatarDropdown.AvatarDropdownPopover.link.createColony',
    defaultMessage: 'Create a Colony',
  },
  reportBugs: {
    id: 'users.AvatarDropdown.AvatarDropdownPopover.link.reportBugs',
    defaultMessage: 'Report Bugs',
  },
  helpCenter: {
    id: 'users.AvatarDropdown.AvatarDropdownPopover.link.helpCenter',
    defaultMessage: 'Help Center',
  },
  signOut: {
    id: 'users.AvatarDropdown.AvatarDropdownPopover.link.signOut',
    defaultMessage: 'Sign Out',
  },
});

interface Props {
  closePopover: () => void;
  username?: string | null;
  walletConnected?: boolean;
  preventTransactions?: boolean;
  // colony: Colony;
  colony: Record<string, unknown>;
}

const displayName = 'users.AvatarDropdown.AvatarDropdownPopover';

const AvatarDropdownPopover = ({
  closePopover,
  username,
  walletConnected = false,
  preventTransactions = false,
  colony,
}: Props) => {
  const { updateWallet } = useAppContext();

  // const handleLogout = useCallback(() => {
  //   if (updateWallet) {
  //     console.log('called?')
  //     updateWallet();
  //   }
  // }, [updateWallet]);

  const renderUserSection = useCallback(() => {
    return (
      <DropdownMenuSection separator>
        {!username && (
          <DropdownMenuItem>
            <NavLink
              to={{
                pathname: CREATE_USER_ROUTE,
                state: colony?.colonyName
                  ? { colonyURL: `/colony/${colony?.colonyName}` }
                  : {},
              }}
              text={MSG.buttonGetStarted}
            />
          </DropdownMenuItem>
        )}
        {username && (
          <DropdownMenuItem>
            <NavLink
              to={`/user/${username}`}
              text={MSG.myProfile}
              data-test="userProfile"
            />
          </DropdownMenuItem>
        )}
        {username && (
          <DropdownMenuItem>
            <NavLink
              to={USER_EDIT_ROUTE}
              text={MSG.settings}
              data-test="userProfileSettings"
            />
          </DropdownMenuItem>
        )}
      </DropdownMenuSection>
    );
  }, [colony, username]);

  const renderColonySection = () => (
    <DropdownMenuSection separator>
      <DropdownMenuItem>
        <NavLink to={CREATE_COLONY_ROUTE} text={MSG.createColony} />
      </DropdownMenuItem>
    </DropdownMenuSection>
  );

  const renderHelperSection = () => (
    <DropdownMenuSection separator>
      <DropdownMenuItem>
        <ExternalLink
          href={FEEDBACK}
          text={MSG.reportBugs}
          className={styles.externalLink}
        />
      </DropdownMenuItem>
      <DropdownMenuItem>
        <ExternalLink
          href={HELP}
          text={MSG.helpCenter}
          className={styles.externalLink}
        />
      </DropdownMenuItem>
    </DropdownMenuSection>
  );

  const renderMetaSection = () =>
    walletConnected && (
      <DropdownMenuSection separator>
        <DropdownMenuItem>
          <ActionButton
            appearance={{ theme: 'no-style' }}
            text={MSG.signOut}
            submit={ActionTypes.USER_LOGOUT}
            error={ActionTypes.USER_LOGOUT_ERROR}
            success={ActionTypes.USER_LOGOUT_SUCCESS}
            onSuccess={updateWallet}
          />
        </DropdownMenuItem>
      </DropdownMenuSection>
    );

  return (
    <DropdownMenu onClick={closePopover}>
      {!preventTransactions ? (
        <>
          {/* {renderUserSection()} */}
          {/* {renderColonySection()} */}
          {renderHelperSection()}
          {renderMetaSection()}
        </>
      ) : (
        <>
          {/* {renderUserSection()} */}
          {renderHelperSection()}
          {renderMetaSection()}
        </>
      )}
    </DropdownMenu>
  );
};

AvatarDropdownPopover.displayName = displayName;

export default AvatarDropdownPopover;
