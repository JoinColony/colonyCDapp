import React, { FC } from 'react';

import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';
import Spinner from '~v5/shared/Spinner';

const displayName = 'frame.Extensions.pages.IntegrationsPage';

const IntegrationsPage: FC = () => (
  <Spinner loadingText={{ id: 'loading.integrationsPage' }}>
    <TwoColumns aside={<Navigation pageName="extensions" />}>
      Integrations page
    </TwoColumns>
  </Spinner>
);

IntegrationsPage.displayName = displayName;

export default IntegrationsPage;
