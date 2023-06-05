import React, { FC } from 'react';

import Navigation from '~common/Extensions/Navigation';
import TwoColumns from '~frame/Extensions/TwoColumns';
import Spinner from '~shared/Extensions/Spinner';

const displayName = 'frame.Extensions.pages.IncorporationPage';

const IncorporationPage: FC = () => (
  <Spinner loadingText="incorporationPage">
    <TwoColumns aside={<Navigation />}>Incorporation page</TwoColumns>
  </Spinner>
);

IncorporationPage.displayName = displayName;

export default IncorporationPage;
