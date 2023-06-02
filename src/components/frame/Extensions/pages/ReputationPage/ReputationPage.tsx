import React, { FC } from 'react';

import Navigation from '~common/Extensions/Navigation';
import TwoColumns from '~frame/Extensions/TwoColumns';
import Spinner from '~shared/Extensions/Spinner';

const displayName = 'frame.Extensions.pages.ReputationPage';

const ReputationPage: FC = () => (
  <Spinner loadingText="reputationPage">
    <TwoColumns aside={<Navigation />}>Reputation page</TwoColumns>
  </Spinner>
);

ReputationPage.displayName = displayName;

export default ReputationPage;
