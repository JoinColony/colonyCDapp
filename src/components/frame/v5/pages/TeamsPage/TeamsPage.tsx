import React, { FC } from 'react';

import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';
import Spinner from '~v5/shared/Spinner';

const TeamsPage: FC = () => (
  <Spinner loading={false} loadingText={{ id: 'loading.teamsPage' }}>
    <TwoColumns aside={<Navigation pageName="members" />}>
      Teams page
    </TwoColumns>
  </Spinner>
);

export default TeamsPage;
