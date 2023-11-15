import React, { FC } from 'react';
import { useMobile } from '~hooks';

import Select from '~v5/common/Fields/Select';
import { UserHubMobileProps } from './types';

export const displayName = 'common.Extensions.UserHub.partials.UserHubMobile';

const UserHubMobile: FC<UserHubMobileProps> = ({
  selectedTab,
  onTabChange,
  tabList,
}) => {
  const isMobile = useMobile();

  return (
    <div className={`${isMobile ? 'pt-0' : 'pt-5'} flex w-full`}>
      <Select
        list={tabList}
        selectedElement={selectedTab}
        handleChange={onTabChange}
      />
    </div>
  );
};

UserHubMobile.displayName = displayName;

export default UserHubMobile;
