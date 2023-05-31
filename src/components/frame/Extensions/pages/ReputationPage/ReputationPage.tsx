import React, { FC } from 'react';

import Spinner from '~shared/Extensions/Spinner';

const displayName = 'frame.Extensions.pages.ReputationPage';

const ReputationPage: FC = () => <Spinner loadingText="reputationPage">Reputation page</Spinner>;

ReputationPage.displayName = displayName;

export default ReputationPage;
