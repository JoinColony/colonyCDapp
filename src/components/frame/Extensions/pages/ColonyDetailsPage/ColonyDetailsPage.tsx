import React, { FC } from 'react';

import Navigation from '~common/Extensions/Navigation';
import TwoColumns from '~frame/Extensions/TwoColumns';
import Spinner from '~shared/Extensions/Spinner';

const displayName = 'frame.Extensions.pages.ColonyDetailsPage';

const ColonyDetailsPage: FC = () => (
  <Spinner loadingText="colonyDetailsPage">
    <TwoColumns aside={<Navigation />}>Colony Details page</TwoColumns>
  </Spinner>
);

ColonyDetailsPage.displayName = displayName;

export default ColonyDetailsPage;
