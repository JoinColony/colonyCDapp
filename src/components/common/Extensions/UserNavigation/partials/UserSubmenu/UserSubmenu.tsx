import React from 'react';

import { UserMenuItemName } from '../UserMenu/types';

import { Contact, Developers, Legal } from './partials';

const displayName = 'common.Extensions.UserNavigation.partials.UserSubmenu';

interface UserSubmenuProps {
  submenuId: UserMenuItemName;
}

const UserSubmenu = ({ submenuId }: UserSubmenuProps) => {
  switch (submenuId) {
    case UserMenuItemName.CONTACT_AND_SUPPORT:
      return <Contact />;
    case UserMenuItemName.DEVELOPERS:
      return <Developers />;
    case UserMenuItemName.LEGAL_AND_PRIVACY:
      return <Legal />;
    default:
      return null;
  }
};

UserSubmenu.displayName = displayName;

export default UserSubmenu;
