import { LockKey } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';

import { useMobile } from '~hooks';
import useRelativePortalElement from '~hooks/useRelativePortalElement.ts';
import useToggle from '~hooks/useToggle/index.ts';
import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import TokenInfo from '~shared/TokenInfo/index.ts';
import { type Token } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import { multiLineTextEllipsis } from '~utils/strings.ts';
import MenuContainer from '~v5/shared/MenuContainer/index.ts';
import Modal from '~v5/shared/Modal/index.ts';
import Portal from '~v5/shared/Portal/index.ts';

interface NativeTokenPillProps {
  variant?: 'primary' | 'secondary';
  token: Token;
  isLocked?: boolean;
}

const displayName = 'v5.shared.NativeTokenPill';

const NativeTokenPill = ({
  variant = 'primary',
  token,
  isLocked = false,
}: NativeTokenPillProps) => {
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

  return (
    <>
      <button
        type="button"
        ref={relativeElementRef}
        className={clsx(
          'group flex h-[1.875rem] cursor-pointer flex-row items-center rounded-lg px-1.5 text-gray-900',
          {
            'bg-base-bg': variant === 'primary',
            'border border-gray-200 bg-base-white': variant === 'secondary',
          },
        )}
        onClick={isMobile ? toggleTokenModalOn : toggleToken}
      >
        <span
          className={clsx('text-sm font-medium', {
            'text-gray-900 group-hover:text-blue-400': !isTokenInfoShown,
            'text-blue-400': isTokenInfoShown,
          })}
        >
          {multiLineTextEllipsis(token.symbol, 5)}
        </span>
        {isLocked && (
          <Tooltip
            tooltipContent={
              <span>{formatText({ id: 'tooltip.lockedToken' })}</span>
            }
          >
            <LockKey size={11} className="ml-0.5" />
          </Tooltip>
        )}
      </button>
      {isMobile ? (
        <Modal
          isFullOnMobile={false}
          onClose={toggleTokenModalOff}
          isOpen={isTokenModalOpened}
          withPadding={false}
        >
          <TokenInfo className="w-full" token={token} isTokenNative />
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
              <TokenInfo token={token} isTokenNative />
            </MenuContainer>
          </Portal>
        )
      )}
    </>
  );
};

NativeTokenPill.displayName = displayName;
export default NativeTokenPill;
