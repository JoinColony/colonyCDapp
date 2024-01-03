import React, { FC } from 'react';

import { useSetPageHeadingTitle } from '~context';
import { formatText } from '~utils/intl';

import { useVerifiedPage } from './hooks';
import VerifiedTable from './partials/VerifiedTable';

const displayName = 'v5.pages.VerifiedPage';

const VerifiedPage: FC = () => {
  const { verifiedMembers } = useVerifiedPage();

  useSetPageHeadingTitle(formatText({ id: 'verifiedPage.title' }));

  return (
    <div className="w-full">
      <VerifiedTable list={verifiedMembers} />
    </div>
  );
};

VerifiedPage.displayName = displayName;

export default VerifiedPage;
