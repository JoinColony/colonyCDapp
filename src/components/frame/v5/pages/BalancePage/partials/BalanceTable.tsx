import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import Filter from '~v5/common/Filter';
import Button from '~v5/shared/Button';
import EmptyContent from '~v5/common/EmptyContent';
import { useSearchContext } from '~context/SearchContext';
import TableHead from './TableHead';
import TableItem from './TableItem';
import { formatText } from '~utils/intl';
import Modal from '~v5/shared/Modal';
import { useColonyContext } from '~hooks';

const displayName = 'v5.pages.VerifiedPage.partials.BalaceTable';

const BalaceTable: FC = () => {
  //   const { searchValue } = useSearchContext();
  const { colony } = useColonyContext();
  const { balances, nativeToken, status } = colony || {};
  const { nativeToken: nativeTokenStatus } = status || {};
  //   const { onChange, selectedMembers } = useVerifiedTable();
  const onAddFunds = () => {}; // @TODO: open modal

  console.log(colony?.tokens?.items);

  return (
    <>
      <div className="py-5 px-4 border border-gray-200 rounded-t-lg">
        <div className="flex sm:justify-between sm:items-center sm:flex-row flex-col">
          <div className="flex items-center">
            <h4 className="heading-5 mr-3">
              {formatText({ id: 'balancePage.table.title' })}
            </h4>
          </div>
          <div className="flex items-center mt-2.5 sm:mt-0">
            {/* {(!!listLength || !!searchValue) && <Filter />} */}
            <Button
              mode="primarySolid"
              className="ml-2"
              onClick={onAddFunds}
              size="small"
            >
              {formatText({ id: 'balancePage.table.addFunds' })}
            </Button>
          </div>
        </div>
      </div>
      <TableHead onClick={() => {}} />
      {colony?.tokens && (
        <div className="px-4 border border-gray-200 rounded-b-lg">
          {colony.tokens.items.map((item) => (
            <TableItem
              key={item?.token.tokenAddress}
              token={item?.token}
              isTokenNative={
                item?.token.tokenAddress === nativeToken?.tokenAddress
              }
              balances={balances || {}}
              nativeTokenStatus={nativeTokenStatus || {}}
              onChange={() => {}}
            />
          ))}
        </div>
      )}
      {/* <Modal
          isFullOnMobile={false}
          onClose={onCloseModal}
          isOpen={isOpen}
          isTopSectionWithBackground={isTopSectionWithBackground}
        >
          {content}
        </Modal> */}
    </>
  );
};

BalaceTable.displayName = displayName;

export default BalaceTable;
