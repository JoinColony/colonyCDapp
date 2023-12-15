import React, { FC } from 'react';
import clsx from 'clsx';

import { LockKey } from 'phosphor-react';
import { useMobile, useRelativePortalElement, useToggle } from '~hooks';
import CopyableAddress from '~shared/CopyableAddress';
import TokenIcon from '~shared/TokenIcon';
import Modal from '~v5/shared/Modal';
import MenuContainer from '~v5/shared/MenuContainer';
import Portal from '~v5/shared/Portal';

import { TokenAvatarProps } from './types';
import Tooltip from '~shared/Extensions/Tooltip';
import { formatText } from '~utils/intl';

const displayName = 'v5.pages.BalancePage.partials.TokenAvatar';
// @TODO: implement token popover according to the design
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

  const content = (
    <div className="flex gap-4 items-center">
      <TokenIcon token={token} size="xs" />
      <div className="flex items-center gap-1">
        {token.name ? (
          <span
            className={clsx('text-gray-900 font-medium', {
              'truncate max-w-[6.25rem] md:max-w-full': !isTokenModalOpened,
              'md:whitespace-normal': isTokenModalOpened,
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
        className="flex gap-4 items-center"
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
          {content}
        </Modal>
      ) : (
        isTokenVisible && (
          <Portal>
            <MenuContainer
              className="absolute p-1 z-[60]"
              hasShadow
              rounded="s"
              ref={(ref) => {
                registerContainerRef(ref);
                portalElementRef.current = ref;
              }}
            >
              {content}
            </MenuContainer>
          </Portal>
        )
      )}
    </div>
  );
};

TokenAvatar.displayName = displayName;

export default TokenAvatar;
