import React, { FC } from 'react';
import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';
import Spinner from '~v5/shared/Spinner';
import BalaceTable from './partials/BalanceTable';
import { useBalancePage } from './hooks';
import { BalanceList } from './types';

const displayName = 'v5.pages.BalancePage';

const BalancePage: FC = () => {
  const { colony, isSortedDesc, onBalanceSort } = useBalancePage();

  return (
    <Spinner loading={false} loadingText={{ id: 'loading.advancedPage' }}>
      <TwoColumns aside={<Navigation pageName="members" />}>
        {/* @TODO: use exiting table component */}
        <div className="flex justify-between mt-6">
          <div className="w-full">
            <BalaceTable
              data={colony as BalanceList[]}
              isSorted={isSortedDesc}
              onBalanceSort={onBalanceSort}
            />
          </div>
        </div>
      </TwoColumns>
    </Spinner>
  );
};

BalancePage.displayName = displayName;

export default BalancePage;
