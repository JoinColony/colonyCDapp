import React, { FC } from 'react';

import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';
import Spinner from '~v5/shared/Spinner';

const displayName = 'frame.Extensions.pages.ColonyDetailsPage';

const ColonyDetailsPage: FC = () => (
  <Spinner loadingText={{ id: 'loading.colonyDetailsPage' }}>
    <TwoColumns aside={<Navigation pageName="extensions" />}>
      Colony Details page
    </TwoColumns>
  </Spinner>
);

ColonyDetailsPage.displayName = displayName;

export default ColonyDetailsPage;
