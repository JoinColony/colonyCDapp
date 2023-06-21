import React, { FC } from 'react';

import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';
import Spinner from '~v5/shared/Spinner';

const displayName = 'frame.Extensions.pages.ReputationPage';

const ReputationPage: FC = () => (
  <Spinner loadingText={{ id: 'loading.reputationPage' }}>
    <TwoColumns aside={<Navigation />}>Reputation page</TwoColumns>
  </Spinner>
);

ReputationPage.displayName = displayName;

export default ReputationPage;
