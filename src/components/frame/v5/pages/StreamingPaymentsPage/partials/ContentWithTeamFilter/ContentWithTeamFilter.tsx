import React from 'react';

import TeamFilter from '~v5/shared/TeamFilter/TeamFilter.tsx';

export interface ContentWithTeamFilterProps {
  children: React.ReactNode;
}

const displayName =
  'v5.pages.StreamingPaymentsPage.partials.ContentWithTeamFilter';

export const ContentWithTeamFilter = ({
  children,
}: ContentWithTeamFilterProps) => {
  return (
    <>
      <TeamFilter />
      <div className="pt-8">{children}</div>
    </>
  );
};

ContentWithTeamFilter.displayName = displayName;

export default ContentWithTeamFilter;
