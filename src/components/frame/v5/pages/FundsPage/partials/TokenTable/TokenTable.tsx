import { getSortedRowModel, SortingState } from '@tanstack/react-table';
import clsx from 'clsx';
import { BigNumber } from 'ethers';
import React, { FC, useState } from 'react';

import { useColonyContext } from '~context/ColonyContext.tsx';
import { useMobile } from '~hooks/index.ts';
import useColonyFundsClaims from '~hooks/useColonyFundsClaims.ts';
import useRelativePortalElement from '~hooks/useRelativePortalElement.ts';
import useToggle from '~hooks/useToggle/index.ts';
import Numeral from '~shared/Numeral/index.ts';
import TokenIcon from '~shared/TokenIcon/index.ts';
import TokenInfo from '~shared/TokenInfoPopover/TokenInfo.tsx';
import Table from '~v5/common/Table/index.ts';
import AccordionItem from '~v5/shared/Accordion/partials/AccordionItem/index.ts';
import MenuContainer from '~v5/shared/MenuContainer/index.ts';
import Modal from '~v5/shared/Modal/index.ts';
import Portal from '~v5/shared/Portal/index.ts';

import { useTokenTableColumns } from './hooks.tsx';
import { TokenTableProps } from './types.ts';

const displayName = 'v5.pages.FundsPage.partials.TokenTable';

const TokenTable: FC<TokenTableProps> = ({ token }) => {
  const isMobile = useMobile();
  const {
    colony: { nativeToken },
  } = useColonyContext();
  const claims = useColonyFundsClaims();
  const currentClaims = claims.filter(
    ({ token: currentClaimToken }) => currentClaimToken?.name === token?.name,
  );
  const claimsAmount =
    currentClaims.reduce(
      (acc, { amount }) => acc.add(amount),
      BigNumber.from(0),
    ) || 0;
  const [isTableRowOpen, { toggle: toggleTableRowAccordion }] = useToggle();
  const columns = useTokenTableColumns();
  const [sorting, setSorting] = useState<SortingState>([]);

  const [
    isTokenModalOpened,
    { toggleOff: toggleTokenModalOff, toggleOn: toggleTokenModalOn },
  ] = useToggle();
  const [isTokenVisible, { toggle: toggleToken, registerContainerRef }] =
    useToggle();
  const isTokenInfoShown = isTokenModalOpened || isTokenVisible;

  const { portalElementRef, relativeElementRef } = useRelativePortalElement<
    HTMLButtonElement,
    HTMLDivElement
  >([isTokenVisible], {
    top: 8,
  });

  const isTokenNative = token?.tokenAddress === nativeToken.tokenAddress;

  const handleToggleToken = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (isMobile) {
      toggleTokenModalOn();
    } else {
      toggleToken();
    }
  };

  return claimsAmount.gt(0) && token ? (
    <>
      <AccordionItem
        className="text-1 text-gray-900 w-full [&_.accordion-toggler]:px-[1.125rem] sm:hover:[&_.accordion-toggler]:bg-gray-25"
        isOpen={isTableRowOpen}
        onToggle={toggleTableRowAccordion}
        iconName="chevron-down"
        title={
          <div className="flex items-center justify-between w-full py-4 text-gray-900">
            <button
              type="button"
              className="flex items-center gap-4 group"
              ref={relativeElementRef}
              onClick={handleToggleToken}
            >
              <TokenIcon token={token} size="xs" />
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
            </button>
            <div>
              <Numeral value={claimsAmount} decimals={nativeToken.decimals} />{' '}
              {token?.symbol}
            </div>
          </div>
        }
      >
        <Table
          data={currentClaims}
          state={{ sorting }}
          onSortingChange={setSorting}
          getSortedRowModel={getSortedRowModel()}
          verticalOnMobile={false}
          columns={columns}
          className="border-0 rounded-none -mx-[1.125rem] px-[1.125rem] !w-[calc(100%+2.25rem)] [&_td]:px-[1.125rem] [&_th]:border-y border-gray-200 [&_td]:py-4"
        />
      </AccordionItem>
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
    </>
  ) : null;
};

TokenTable.displayName = displayName;

export default TokenTable;
