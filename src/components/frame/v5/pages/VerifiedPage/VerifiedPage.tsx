import React, { FC } from 'react';

import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';

const VerifiedPage: FC = () => (
  <TwoColumns aside={<Navigation pageName="members" />}>
    Verified page
  </TwoColumns>
);

export default VerifiedPage;
