import React, { type FC, type PropsWithChildren } from 'react';

const displayName = 'v5.common.SettingsRow.Description';

interface SettingsRowDescriptionProps extends PropsWithChildren {}

const SettingsRowDescription: FC<SettingsRowDescriptionProps> = ({
  children,
}) => {
  return <p className="text-sm text-gray-600">{children}</p>;
};

SettingsRowDescription.displayName = displayName;
export default SettingsRowDescription;
