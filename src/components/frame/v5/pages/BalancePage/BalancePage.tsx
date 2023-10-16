import React, { FC } from 'react';
import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';
import Spinner from '~v5/shared/Spinner';
import BalaceTable from './partials/BalanceTable';

const displayName = 'frame.Extensions.pages.BalancePage';

const BalancePage: FC = () => {
  return (
    <Spinner loading={false} loadingText={{ id: 'loading.advancedPage' }}>
      <TwoColumns aside={<Navigation pageName="members" />}>
        {/* @TODO: use exiting table component */}
        <div className="flex justify-between mt-6">
          <div className="w-full">
            <BalaceTable />
          </div>
        </div>
      </TwoColumns>
    </Spinner>
  );
};

BalancePage.displayName = displayName;

export default BalancePage;
