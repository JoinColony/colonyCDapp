import React, { FC } from 'react';

import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';

const ContributorsPage: FC = () => (
  <TwoColumns aside={<Navigation pageName="members" />}>
    Contributors page
  </TwoColumns>
);

export default ContributorsPage;
