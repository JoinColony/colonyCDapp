import { LockKey } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { useMobile } from '~hooks/index.ts';
import useRelativePortalElement from '~hooks/useRelativePortalElement.ts';
import useToggle from '~hooks/useToggle/index.ts';
import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import TokenInfo from '~shared/TokenInfo/index.ts';
import { formatText } from '~utils/intl.ts';
import CopyableAddress from '~v5/shared/CopyableAddress/index.ts';
import MenuContainer from '~v5/shared/MenuContainer/index.ts';
import Modal from '~v5/shared/Modal/index.ts';
import Portal from '~v5/shared/Portal/index.ts';
import { TokenAvatar } from '~v5/shared/TokenAvatar/TokenAvatar.tsx';

import { type TokenCellProps } from './types.ts';

const displayName = 'v5.pages.BalancePage.partials.TokenCell';

const TokenCell: FC<TokenCellProps> = ({
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
    <div className="flex items-center gap-2 text-left md:gap-4">
      <TokenAvatar
        size={26}
        tokenName={token.name}
        tokenAddress={token.tokenAddress}
        tokenAvatarSrc={token.avatar ?? undefined}
        className={clsx('flex-shrink-0', {
          '!h-6 !w-6': isMobile,
        })}
      />
      <div className="flex items-center gap-1">
        {token.name ? (
          <span
            className={clsx('line-clamp-2 font-medium break-word', {
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
              <span className="text-left sm:w-64">
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
    <div className="relative flex">
      <button
        type="button"
        ref={relativeElementRef}
        className="group flex items-center gap-4"
        onClick={isMobile ? toggleTokenModalOn : toggleToken}
      >
        {content}
      </button>
      {isMobile ? (
        <Modal
          isFullOnMobile={false}
          onClose={toggleTokenModalOff}
          isOpen={isTokenModalOpened}
          withPadding={false}
        >
          <TokenInfo
            className="w-full"
            token={token}
            isTokenNative={isTokenNative}
          />
        </Modal>
      ) : (
        isTokenVisible && (
          <Portal>
            <MenuContainer
              className="absolute z-sidebar min-w-80 !p-0"
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

TokenCell.displayName = displayName;

export default TokenCell;
