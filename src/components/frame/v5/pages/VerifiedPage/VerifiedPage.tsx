import React, { FC } from 'react';

import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';
import { useSearchContext } from '~context/SearchContext';
import Spinner from '~v5/shared/Spinner';
import Table from './partials/Table';
import { useVerifiedPage } from './hooks';

const VerifiedPage: FC = () => {
  const { searchValue } = useSearchContext();
  const { searchedVerified } = useVerifiedPage(searchValue);

  return (
    <Spinner loadingText={{ id: 'loading.verifiedPage' }}>
      <TwoColumns aside={<Navigation pageName="members" />}>
        <div className="flex justify-between mt-6">
          <div className="w-full">
            <Table list={searchedVerified} onReputationSortClick={() => {}} />
          </div>
        </div>
      </TwoColumns>
    </Spinner>
  );
};

export default VerifiedPage;
