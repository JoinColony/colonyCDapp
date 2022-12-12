import React, { ReactNode } from 'react';
import { PopperOptions } from 'react-popper-tooltip';

import Popover from '~shared/Popover';
import { Token } from '~types';

import TokenInfo from './TokenInfo';

export type Props = {
  /** Token object */
  token: Token;
  /** Does token represent the chain's native token? */
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

const displayName = 'TokenInfoPopover';

const TokenInfoPopover = ({
  token,
  isTokenNative,
  children,
  popperOptions,
  trigger = 'click',
  showArrow = true,
}: Props) => (
  <Popover
    renderContent={<TokenInfo token={token} isTokenNative={isTokenNative} />}
    popperOptions={popperOptions}
    trigger={trigger}
    showArrow={showArrow}
  >
    {children}
  </Popover>
);

TokenInfoPopover.displayName = displayName;

export default TokenInfoPopover;
