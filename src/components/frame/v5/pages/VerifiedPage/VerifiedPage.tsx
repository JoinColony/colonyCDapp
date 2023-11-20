import React, { FC } from 'react';

import { useVerifiedPage } from './hooks';
import VerifiedTable from './partials/VerifiedTable';

const displayName = 'v5.pages.VerifiedPage';

const VerifiedPage: FC = () => {
  const { verifiedMembers } = useVerifiedPage();

  return (
    <div className="w-full">
      <VerifiedTable list={verifiedMembers} />
    </div>
  );
};

VerifiedPage.displayName = displayName;

export default VerifiedPage;
