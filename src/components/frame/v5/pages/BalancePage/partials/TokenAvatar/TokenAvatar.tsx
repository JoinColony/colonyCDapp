import clsx from 'clsx';
import { LockKey } from 'phosphor-react';
import React, { FC } from 'react';

import { useMobile, useRelativePortalElement, useToggle } from '~hooks';
import CopyableAddress from '~shared/CopyableAddress';
import Tooltip from '~shared/Extensions/Tooltip';
import TokenIcon from '~shared/TokenIcon';
import TokenInfo from '~shared/TokenInfoPopover/TokenInfo';
import { formatText } from '~utils/intl';
import MenuContainer from '~v5/shared/MenuContainer';
import Modal from '~v5/shared/Modal';
import Portal from '~v5/shared/Portal';

import { TokenAvatarProps } from './types';

const displayName = 'v5.pages.BalancePage.partials.TokenAvatar';

const TokenAvatar: FC<TokenAvatarProps> = ({
  token,
  isTokenNative,
  nativeTokenStatus,
}) => {
  const isMobile = useMobile();

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
          <CopyableAddress>{token.tokenAddress}</CopyableAddress>
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
