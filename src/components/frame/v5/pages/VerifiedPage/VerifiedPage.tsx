import React, { FC } from 'react';
import Navigation from '~v5/common/Navigation/Navigation';
import TwoColumns from '~v5/frame/TwoColumns/TwoColumns';

const VerifiedPage: FC = () => (
  <TwoColumns aside={<Navigation pageName="members" />}>
    Verified page
  </TwoColumns>
);

export default VerifiedPage;
