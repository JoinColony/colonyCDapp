import { LockKey } from '@phosphor-icons/react';
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
  token: Token;
  isLocked?: boolean;
}

const displayName = 'v5.shared.NativeTokenPill';

const NativeTokenPill = ({ token, isLocked = false }: NativeTokenPillProps) => {
  const isMobile = useMobile();

  const [
    isTokenModalVisible,
    {
      toggle: toggleTokenModal,
      toggleOff: toggleTokenModalOff,
      registerContainerRef,
    },
  ] = useToggle();

  const { portalElementRef, relativeElementRef } = useRelativePortalElement<
    HTMLButtonElement,
    HTMLDivElement
  >([isTokenModalVisible], {
    top: 8,
  });

  return (
    <>
      <button
        type="button"
        ref={relativeElementRef}
        className="flex h-[1.75rem] cursor-pointer flex-row items-center rounded-[32px] bg-blue-100 px-2.5 text-gray-900"
        onClick={toggleTokenModal}
      >
        <span className="text-sm font-medium text-blue-400">
          {multiLineTextEllipsis(token.symbol, 5)}
        </span>
        {isLocked && (
          <Tooltip
            tooltipContent={
              <span>{formatText({ id: 'tooltip.lockedToken' })}</span>
            }
          >
            <LockKey size={11} className="ml-0.5 text-blue-400" />
          </Tooltip>
        )}
      </button>
      {isMobile ? (
        <Modal
          isFullOnMobile={false}
          onClose={toggleTokenModalOff}
          isOpen={isTokenModalVisible}
          withPadding={false}
        >
          <TokenInfo className="w-full" token={token} isTokenNative />
        </Modal>
      ) : (
        isTokenModalVisible && (
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
