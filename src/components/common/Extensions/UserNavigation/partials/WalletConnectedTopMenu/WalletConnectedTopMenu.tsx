import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { UserCircleGear, Wallet } from '@phosphor-icons/react';
import React, { type PropsWithChildren, type FC } from 'react';
import { useIntl, defineMessages } from 'react-intl';

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

const MSG = defineMessages({
  manageEmbedded: {
    id: `${displayName}.manageEmbedded`,
    defaultMessage: 'Manage wallet',
  },
});

const WalletConnectedTopMenu: FC<PropsWithChildren> = ({ children }) => {
  const { formatMessage } = useIntl();
  const { user, wallet } = useAppContext();
  const isTablet = useTablet();
  const { setShowAuthFlow } = useDynamicContext();

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
      {/*
       * Only show the manage embedded wallet link if the wallet is embedded / custodial
       * All the other wallet types have their own interface
       */}
      {wallet?.label === 'turnkeyhd' && (
        <div className="navigation-link -ml-4 w-[calc(100%+2rem)] rounded hover:bg-gray-50">
          <Wallet size={iconSize} />
          <button
            type="button"
            className="ml-2"
            onClick={() => setShowAuthFlow(true)}
          >
            {formatMessage(MSG.manageEmbedded)}
          </button>
        </div>
      )}
    </div>
  );
};

WalletConnectedTopMenu.displayName = displayName;

export default WalletConnectedTopMenu;
