import React from 'react';

import { Contact, Developers, Legal } from './partials';

const displayName = 'common.Extensions.UserNavigation.partials.UserSubmenu';

interface UserSubmenuProps {
  submenuId: string;
}
const UserSubmenu = ({ submenuId }: UserSubmenuProps) => {
  switch (submenuId) {
    case 'userMenu.contactAndSupportTitle':
      return <Contact />;
    case 'userMenu.developersTitle':
      return <Developers />;
    case 'userMenu.legalAndPrivacyTitle':
      return <Legal />;
    default:
      return null;
  }
};

UserSubmenu.displayName = displayName;

export default UserSubmenu;
