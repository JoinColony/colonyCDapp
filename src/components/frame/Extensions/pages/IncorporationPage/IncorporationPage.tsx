import React, { FC } from 'react';

import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';
import Spinner from '~v5/shared/Spinner';

const displayName = 'frame.Extensions.pages.IncorporationPage';

const IncorporationPage: FC = () => (
  <Spinner loadingText={{ id: 'loading.incorporationPage' }}>
    <TwoColumns aside={<Navigation />}>Incorporation page</TwoColumns>
  </Spinner>
);

IncorporationPage.displayName = displayName;

export default IncorporationPage;
