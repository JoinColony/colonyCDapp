import React, { FC } from 'react';
import { useMobile } from '~hooks';
import Select from '~shared/Extensions/Select';
import { UserHubMobileProps } from './types';
import styles from './UserHub.module.css';

export const displayName = 'common.Extensions.UserHub.partials.UserHubMobile';

const UserHubMobile: FC<UserHubMobileProps> = ({ selectedTab, handleChange, tabList }) => {
  const isMobile = useMobile();

  return (
    <div className={`${isMobile ? 'pt-0' : 'pt-5'} ${styles.wrapper}`}>
      <Select list={tabList} selectedElement={selectedTab} handleChange={handleChange} />
    </div>
  );
};

UserHubMobile.displayName = displayName;

export default UserHubMobile;
