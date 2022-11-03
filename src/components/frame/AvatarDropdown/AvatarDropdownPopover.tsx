import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';

import { ActionButton } from '~shared/Button';
import NavLink from '~shared/NavLink';
import ExternalLink from '~shared/ExternalLink';
import { FEEDBACK, HELP } from '~constants/externalUrls';

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
import {
  useAppContext,
  useUserAccountRegistered,
  useCanInteractWithNetwork,
} from '~hooks';

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
  // colony: Colony;
  colony: Record<string, unknown>;
}

const displayName = 'frame.AvatarDropdown.AvatarDropdownPopover';

const AvatarDropdownPopover = ({ closePopover, colony }: Props) => {
  const { updateWallet, user, wallet } = useAppContext();
  const userHasAccountRegistered = useUserAccountRegistered();
  /*
   * Are the network contract deployed to the chain the user is connected
   * so that they can create a new colony on it
   */
  const canInteractWithNetwork = useCanInteractWithNetwork();

  const renderUserCreateSection = useCallback(() => {
    return (
      <DropdownMenuSection separator>
        {!userHasAccountRegistered && (
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
      </DropdownMenuSection>
    );
  }, [colony, userHasAccountRegistered]);

  const renderUserSection = useCallback(() => {
    return (
      <DropdownMenuSection separator>
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
      </DropdownMenuSection>
    );
  }, [user]);

  const renderColonyCreateSection = () => (
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
    wallet?.address && (
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
      {userHasAccountRegistered
        ? renderUserSection()
        : renderUserCreateSection()}
      {canInteractWithNetwork && renderColonyCreateSection()}
      {renderHelperSection()}
      {renderMetaSection()}
    </DropdownMenu>
  );
};

AvatarDropdownPopover.displayName = displayName;

export default AvatarDropdownPopover;
