import React from 'react';

import { UserMenuItemName } from '../UserMenu/types';

import { Contact, Developers, Legal } from './partials';
import Currency from './partials/Currency/Currency';

const displayName = 'common.Extensions.UserNavigation.partials.UserSubmenu';

interface UserSubmenuProps {
  submenuId: UserMenuItemName;
  closeSubmenu: VoidFunction;
}

const UserSubmenu = ({ submenuId, closeSubmenu }: UserSubmenuProps) => {
  switch (submenuId) {
    case UserMenuItemName.CONTACT_AND_SUPPORT:
      return <Contact />;
    case UserMenuItemName.DEVELOPERS:
      return <Developers />;
    case UserMenuItemName.LEGAL_AND_PRIVACY:
      return <Legal />;
    case UserMenuItemName.CURRENCY:
      return <Currency closeSubmenu={closeSubmenu} />;
    default:
      return null;
  }
};

UserSubmenu.displayName = displayName;

export default UserSubmenu;
