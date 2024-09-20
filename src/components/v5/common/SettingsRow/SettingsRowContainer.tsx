import React, { type FC, type PropsWithChildren } from 'react';

const displayName = 'v5.common.SettingsRow.Container';

interface SettingsRowContainerProps extends PropsWithChildren {}

const SettingsRowContainer: FC<SettingsRowContainerProps> = ({ children }) => {
  return (
    <div className="flex w-full flex-col items-start gap-6 border-b border-gray-200 py-6">
      {children}
    </div>
  );
};

SettingsRowContainer.displayName = displayName;
export default SettingsRowContainer;
