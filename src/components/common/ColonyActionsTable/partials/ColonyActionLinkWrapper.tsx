import React from 'react';
import { type FC, type PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

import { TX_SEARCH_PARAM } from '~routes';
import { setQueryParamOnUrl } from '~utils/urls.ts';

interface ColonyActionLinkWrapperProps extends PropsWithChildren {
  txHash?: string;
  className?: string;
}

export const ColonyActionLinkWrapper: FC<ColonyActionLinkWrapperProps> = ({
  txHash,
  className,
  children,
}) => {
  if (!txHash) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Link
      className={className}
      to={setQueryParamOnUrl({
        params: { [TX_SEARCH_PARAM]: txHash },
      })}
    >
      {children}
    </Link>
  );
};
