import React, { FC } from 'react';

import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';

const MembersPage: FC = () => (
  <TwoColumns aside={<Navigation pageName="members" />}>
    Members page
  </TwoColumns>
);

export default MembersPage;
