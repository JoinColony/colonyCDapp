import { CaretDown } from '@phosphor-icons/react';
import { getSortedRowModel, type SortingState } from '@tanstack/react-table';
import clsx from 'clsx';
import { BigNumber } from 'ethers';
import React, { type FC, useState } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMobile } from '~hooks/index.ts';
import useColonyFundsClaims from '~hooks/useColonyFundsClaims.ts';
import useRelativePortalElement from '~hooks/useRelativePortalElement.ts';
import useToggle from '~hooks/useToggle/index.ts';
import Numeral from '~shared/Numeral/index.ts';
import TokenIcon from '~shared/TokenIcon/index.ts';
import TokenInfo from '~shared/TokenInfo/index.ts';
import Table from '~v5/common/Table/index.ts';
import AccordionItem from '~v5/shared/Accordion/partials/AccordionItem/index.ts';
import MenuContainer from '~v5/shared/MenuContainer/index.ts';
import Modal from '~v5/shared/Modal/index.ts';
import Portal from '~v5/shared/Portal/index.ts';

import { useTokenTableColumns } from './hooks.tsx';
import { type TokenTableProps } from './types.ts';

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
        className="w-full text-gray-900 text-1 [&_.accordion-toggler]:px-[1.125rem] sm:hover:[&_.accordion-toggler]:bg-gray-25"
        isOpen={isTableRowOpen}
        onToggle={toggleTableRowAccordion}
        icon={CaretDown}
        title={
          <div className="flex w-full items-center justify-between py-4 text-gray-900">
            <button
              type="button"
              className="group flex items-center gap-4"
              ref={relativeElementRef}
              onClick={handleToggleToken}
            >
              <TokenIcon token={token} size="xs" />
              <span
                className={clsx('font-medium', {
                  'max-w-[6.25rem] truncate md:max-w-full': !isTokenModalOpened,
                  'md:whitespace-normal': isTokenModalOpened,
                  'text-gray-900 group-hover:text-blue-400': !isTokenInfoShown,
                  'text-blue-400': isTokenInfoShown,
                })}
              >
                {token.name}
              </span>
            </button>
            <div>
              <Numeral value={claimsAmount} decimals={token.decimals} />{' '}
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
          className="-mx-[1.125rem] !w-[calc(100%+2.25rem)] rounded-none border-0 border-gray-200 px-[1.125rem] [&_td]:px-[1.125rem] [&_td]:py-4 [&_th]:border-y"
        />
      </AccordionItem>
      {isMobile ? (
        <Modal
          isFullOnMobile={false}
          onClose={toggleTokenModalOff}
          isOpen={isTokenModalOpened}
        >
          <TokenInfo
            className="w-full !p-0"
            token={token}
            isTokenNative={isTokenNative}
          />
        </Modal>
      ) : (
        isTokenVisible && (
          <Portal>
            <MenuContainer
              className="absolute z-[60] min-w-80 !p-0"
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
