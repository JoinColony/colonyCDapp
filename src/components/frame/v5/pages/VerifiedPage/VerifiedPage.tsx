import React, { FC } from 'react';
import FundsTable from '../FundsPage/partials/FundsTable';

import { useVerifiedPage } from './hooks';
import VerifiedTable from './partials/VerifiedTable';

const displayName = 'v5.pages.VerifiedPage';

const VerifiedPage: FC = () => {
  const { verifiedMembers } = useVerifiedPage();

  return (
    <div className="w-full mt-6">
      <VerifiedTable list={verifiedMembers} />
      <FundsTable />
    </div>
  );
};

VerifiedPage.displayName = displayName;

export default VerifiedPage;
