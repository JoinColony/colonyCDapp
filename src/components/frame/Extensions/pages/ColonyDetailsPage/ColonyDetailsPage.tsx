import React, { FC } from 'react';

import Spinner from '~shared/Extensions/Spinner';

const displayName = 'frame.Extensions.pages.ColonyDetailsPage';

const ColonyDetailsPage: FC = () => <Spinner loadingText="colonyDetailsPage">Colony details page</Spinner>;

ColonyDetailsPage.displayName = displayName;

export default ColonyDetailsPage;
