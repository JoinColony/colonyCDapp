import React, { FC } from 'react';

import { useSetPageHeadingTitle } from '~context/PageHeadingContext/index.ts';
import { formatText } from '~utils/intl.ts';

import { useVerifiedPage } from './hooks.ts';
import VerifiedTable from './partials/VerifiedTable/index.ts';

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
