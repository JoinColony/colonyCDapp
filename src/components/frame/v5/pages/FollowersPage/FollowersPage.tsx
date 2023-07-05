import React, { FC } from 'react';
import Navigation from '~v5/common/Navigation/Navigation';
import TwoColumns from '~v5/frame/TwoColumns/TwoColumns';

const FollowersPage: FC = () => (
  <TwoColumns aside={<Navigation pageName="members" />}>
    Followers page
  </TwoColumns>
);

export default FollowersPage;
