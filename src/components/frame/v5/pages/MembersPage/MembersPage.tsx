import React, { FC } from 'react';
import Navigation from '~v5/common/Navigation/Navigation';
import TwoColumns from '~v5/frame/TwoColumns/TwoColumns';

const MembersPage: FC = () => (
  <TwoColumns aside={<Navigation pageName="members" />}>
    Members page
  </TwoColumns>
);

export default MembersPage;
