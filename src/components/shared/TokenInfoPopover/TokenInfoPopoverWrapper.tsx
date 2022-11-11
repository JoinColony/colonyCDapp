import React, { ReactNode, useMemo } from 'react';
import { PopperOptions } from 'react-popper-tooltip';

import Popover from '~shared/Popover';
import { Token } from '~types';

import TokenInfoPopover from './TokenInfoPopover';

interface TokenContentProps {
  isTokenNative?: boolean;
  token?: Token;
}

type ContentProps = TokenContentProps;

export type Props = ContentProps & {
  /** Children elemnts or components to wrap the tooltip around */
  children?: ReactNode;
  /** Passed onto `Popover` component */
  popperOptions?: PopperOptions;
  /** How the popover gets triggered */
  trigger?: 'hover' | 'click' | 'disabled';
  /** Show an arrow around on the side of the popover */
  showArrow?: boolean;
};

const displayName = 'TokenInfoPopover.TokenInfoPopoverWrapper';

const TokenInfoPopoverWrapper = ({
  children,
  popperOptions,
  trigger = 'click',
  showArrow = true,
  ...contentProps
}: Props) => {
  const renderContent = useMemo(() => {
    if ('token' in contentProps && typeof contentProps.token !== 'undefined') {
      const { isTokenNative, token } = contentProps;
      return <TokenInfoPopover token={token} isTokenNative={!!isTokenNative} />;
    }
    return null;
  }, [contentProps]);

  return (
    <Popover
      renderContent={renderContent}
      popperOptions={popperOptions}
      trigger={trigger}
      showArrow={showArrow}
    >
      {children}
    </Popover>
  );
};

TokenInfoPopoverWrapper.displayName = displayName;

export default TokenInfoPopoverWrapper;
