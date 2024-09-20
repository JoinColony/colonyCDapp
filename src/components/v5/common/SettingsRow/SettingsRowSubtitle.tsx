import React, { type FC, type PropsWithChildren } from 'react';

const displayName = 'v5.common.SettingsRow.Subtitle';

interface SettingsRowSubtitleProps extends PropsWithChildren {}

const SettingsRowSubtitle: FC<SettingsRowSubtitleProps> = ({ children }) => {
  return <h6 className="text-md font-medium text-gray-900">{children}</h6>;
};

SettingsRowSubtitle.displayName = displayName;
export default SettingsRowSubtitle;
