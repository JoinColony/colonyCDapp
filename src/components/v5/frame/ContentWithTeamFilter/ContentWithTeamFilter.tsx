import React, { type FC, type PropsWithChildren } from 'react';

import TeamFilter from '~v5/shared/TeamFilter/TeamFilter.tsx';

const displayName = 'v5.frame.ContentWithTeamFilter';

const ContentWithTeamFilter: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col">
      <div className="pb-6">
        <TeamFilter />
      </div>
      {children}
    </div>
  );
};

ContentWithTeamFilter.displayName = displayName;
export default ContentWithTeamFilter;
