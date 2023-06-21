import React, { FC } from 'react';

import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';
import Spinner from '~shared/Extensions/Spinner';

const displayName = 'frame.Extensions.pages.AdvancedPage';

const AdvancedPage: FC = () => (
  <Spinner loadingText={{ id: 'loading.advancedPage' }}>
    <TwoColumns aside={<Navigation />}>Advanced page</TwoColumns>
  </Spinner>
);

AdvancedPage.displayName = displayName;

export default AdvancedPage;
