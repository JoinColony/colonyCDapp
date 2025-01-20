import { UserCircleGear } from '@phosphor-icons/react';
import React, { type PropsWithChildren, type FC } from 'react';
import { useIntl } from 'react-intl';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useTablet } from '~hooks/index.ts';
import {
  USER_HOME_ROUTE,
  USER_EDIT_PROFILE_ROUTE,
  CREATE_PROFILE_ROUTE,
} from '~routes/index.ts';
import Link from '~v5/shared/Link/index.ts';

const displayName =
  'common.Extensions.UserNavigation.partials.WalletConnectedTopMenu';

const WalletConnectedTopMenu: FC<PropsWithChildren> = ({ children }) => {
  const { formatMessage } = useIntl();
  const { user } = useAppContext();
  const isTablet = useTablet();

  const iconSize = isTablet ? 18 : 16;

  return (
    <div className="mb-6 w-full border-b border-b-gray-200 pb-4 md:mb-5 md:pb-3">
      <div className="mb-4 md:mb-2">{children}</div>
      {user ? (
        <Link
          to={`${USER_HOME_ROUTE}/${USER_EDIT_PROFILE_ROUTE}`}
          className="navigation-link -ml-4 w-[calc(100%+2rem)] rounded hover:bg-gray-50"
        >
          <UserCircleGear size={iconSize} />
          <p className="ml-2">
            {formatMessage({ id: 'userMenu.manageTitle' })}
          </p>
        </Link>
      ) : (
        <Link
          to={CREATE_PROFILE_ROUTE}
          className="navigation-link -ml-4 w-[calc(100%+2rem)] rounded hover:bg-gray-50"
        >
          <UserCircleGear size={iconSize} />
          <p className="ml-2">
            {formatMessage({ id: 'userMenu.createTitle' })}
          </p>
        </Link>
      )}
    </div>
  );
};

WalletConnectedTopMenu.displayName = displayName;

export default WalletConnectedTopMenu;
