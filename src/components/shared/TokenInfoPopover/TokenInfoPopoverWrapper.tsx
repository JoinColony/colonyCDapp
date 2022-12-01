import React, { ReactNode } from 'react';
import { PopperOptions } from 'react-popper-tooltip';

import Popover from '~shared/Popover';
import { Token } from '~types';

import TokenInfoPopover from './TokenInfoPopover';

export type Props = {
  token: Token;
  isTokenNative: boolean;
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
  token,
  isTokenNative,
  children,
  popperOptions,
  trigger = 'click',
  showArrow = true,
}: Props) => {
  const renderContent = () => {
    return <TokenInfoPopover token={token} isTokenNative={!!isTokenNative} />;
  };

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
