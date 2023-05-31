import React, { FC } from 'react';

import Spinner from '~shared/Extensions/Spinner';

const displayName = 'frame.Extensions.pages.IntegrationsPage';

const IntegrationsPage: FC = () => <Spinner loadingText="integrationsPage">Integrations page</Spinner>;

IntegrationsPage.displayName = displayName;

export default IntegrationsPage;
