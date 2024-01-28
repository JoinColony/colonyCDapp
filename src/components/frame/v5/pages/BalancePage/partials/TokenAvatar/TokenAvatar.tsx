import clsx from 'clsx';
import { LockKey } from 'phosphor-react';
import React, { type FC } from 'react';

import { useMobile } from '~hooks/index.ts';
import useRelativePortalElement from '~hooks/useRelativePortalElement.ts';
import useToggle from '~hooks/useToggle/index.ts';
import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import TokenIcon from '~shared/TokenIcon/index.ts';
import TokenInfo from '~shared/TokenInfoPopover/TokenInfo.tsx';
import { formatText } from '~utils/intl.ts';
import CopyableAddress from '~v5/shared/CopyableAddress/index.ts';
import MenuContainer from '~v5/shared/MenuContainer/index.ts';
import Modal from '~v5/shared/Modal/index.ts';
import Portal from '~v5/shared/Portal/index.ts';

import { type TokenAvatarProps } from './types.ts';

const displayName = 'v5.pages.BalancePage.partials.TokenAvatar';

const TokenAvatar: FC<TokenAvatarProps> = ({
  token,
  tokenAddress,
  nativeTokenStatus,
}) => {
  const isMobile = useMobile();
  const isTokenNative = token.tokenAddress === tokenAddress;

  const [
    isTokenModalOpened,
    { toggleOff: toggleTokenModalOff, toggleOn: toggleTokenModalOn },
  ] = useToggle();
  const [isTokenVisible, { toggle: toggleToken, registerContainerRef }] =
    useToggle();

  const { portalElementRef, relativeElementRef } = useRelativePortalElement<
    HTMLButtonElement,
    HTMLDivElement
  >([isTokenVisible], {
    top: 8,
  });
  const isTokenInfoShown = isTokenModalOpened || isTokenVisible;

  const content = (
    <div className="flex gap-4 items-center">
      <TokenIcon token={token} size="xs" />
      <div className="flex items-center gap-1">
        {token.name ? (
          <span
            className={clsx('font-medium', {
              'truncate max-w-[6.25rem] md:max-w-full': !isTokenModalOpened,
              'md:whitespace-normal': isTokenModalOpened,
              'text-gray-900 group-hover:text-blue-400': !isTokenInfoShown,
              'text-blue-400': isTokenInfoShown,
            })}
          >
            {token.name}
          </span>
        ) : (
          <CopyableAddress address={token.tokenAddress} />
        )}
        {isTokenNative && !nativeTokenStatus?.unlocked && (
          <Tooltip
            tooltipContent={
              <span className="sm:w-64 text-left">
                {formatText({ id: 'tooltip.lockedToken' })}
              </span>
            }
          >
            <LockKey size={14} className="mt-px" />
          </Tooltip>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex relative">
      <button
        type="button"
        ref={relativeElementRef}
        className="flex gap-4 items-center group"
        onClick={isMobile ? toggleTokenModalOn : toggleToken}
      >
        {content}
      </button>
      {isMobile ? (
        <Modal
          isFullOnMobile={false}
          onClose={toggleTokenModalOff}
          isOpen={isTokenModalOpened}
        >
          <TokenInfo
            className="!p-0 w-full"
            token={token}
            isTokenNative={isTokenNative}
          />
        </Modal>
      ) : (
        isTokenVisible && (
          <Portal>
            <MenuContainer
              className="absolute !p-0 z-[60] min-w-80"
              hasShadow
              rounded="s"
              ref={(ref) => {
                registerContainerRef(ref);
                portalElementRef.current = ref;
              }}
            >
              <TokenInfo token={token} isTokenNative={isTokenNative} />
            </MenuContainer>
          </Portal>
        )
      )}
    </div>
  );
};

TokenAvatar.displayName = displayName;

export default TokenAvatar;
