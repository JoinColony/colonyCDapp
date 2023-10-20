import React, { FC } from 'react';

import Table from './partials/Table';
import { useVerifiedPage } from './hooks';

const displayName = 'v5.pages.VerifiedPage';

const VerifiedPage: FC = () => {
  const { verifiedMembers } = useVerifiedPage();

  return (
    <div className="flex justify-between mt-6">
      <div className="w-full">
        <Table list={verifiedMembers} onReputationSortClick={() => {}} />
      </div>
    </div>
  );
};

VerifiedPage.displayName = displayName;

export default VerifiedPage;
