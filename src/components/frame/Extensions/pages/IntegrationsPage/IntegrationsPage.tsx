import React, { FC } from 'react';

import Navigation from '~common/Extensions/Navigation';
import TwoColumns from '~frame/Extensions/TwoColumns';
import Spinner from '~shared/Extensions/Spinner';

const displayName = 'frame.Extensions.pages.IntegrationsPage';

const IntegrationsPage: FC = () => (
  <Spinner loadingText={{ id: 'loading.integrationsPage' }}>
    <TwoColumns aside={<Navigation />}>Integrations page</TwoColumns>
  </Spinner>
);

IntegrationsPage.displayName = displayName;

export default IntegrationsPage;
