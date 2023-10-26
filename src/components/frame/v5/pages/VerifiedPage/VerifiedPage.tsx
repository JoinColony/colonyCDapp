import React, { FC } from 'react';

import Table from './partials/Table';
import { useVerifiedPage } from './hooks';

const displayName = 'v5.pages.VerifiedPage';

const VerifiedPage: FC = () => {
  const { verifiedMembers } = useVerifiedPage();

  return (
    <div className="w-full mt-6">
      <Table list={verifiedMembers} onReputationSortClick={() => {}} />
    </div>
  );
};

VerifiedPage.displayName = displayName;

export default VerifiedPage;
