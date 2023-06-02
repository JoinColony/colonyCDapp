import React, { FC } from 'react';
import Navigation from '~common/Extensions/Navigation';
import TwoColumns from '~frame/Extensions/TwoColumns';

import Spinner from '~shared/Extensions/Spinner';

const displayName = 'frame.Extensions.pages.AdvancedPage';

const AdvancedPage: FC = () => (
  <Spinner loadingText="advancedPage">
    <TwoColumns aside={<Navigation />}>Advanced page</TwoColumns>
  </Spinner>
);

AdvancedPage.displayName = displayName;

export default AdvancedPage;
