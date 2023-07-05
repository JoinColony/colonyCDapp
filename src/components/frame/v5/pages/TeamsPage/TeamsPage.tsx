import React, { FC } from 'react';
import Navigation from '~v5/common/Navigation/Navigation';
import TwoColumns from '~v5/frame/TwoColumns/TwoColumns';

const TeamsPage: FC = () => (
  <TwoColumns aside={<Navigation pageName="members" />}>Teams page</TwoColumns>
);

export default TeamsPage;
