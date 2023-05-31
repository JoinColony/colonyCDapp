import React, { FC } from 'react';

import Spinner from '~shared/Extensions/Spinner';

const displayName = 'frame.Extensions.pages.IncorporationPage';

const IncorporationPage: FC = () => <Spinner loadingText="incorporationPage">Incorporation page</Spinner>;

IncorporationPage.displayName = displayName;

export default IncorporationPage;
