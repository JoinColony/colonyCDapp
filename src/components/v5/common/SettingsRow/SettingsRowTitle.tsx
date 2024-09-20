import React, { type FC, type PropsWithChildren } from 'react';

const displayName = 'v5.common.SettingsRow.Title';

interface SettingsRowTitleProps extends PropsWithChildren {}

const SettingsRowTitle: FC<SettingsRowTitleProps> = ({ children }) => {
  return <h5 className="text-gray-900 heading-5">{children}</h5>;
};

SettingsRowTitle.displayName = displayName;
export default SettingsRowTitle;
