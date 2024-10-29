import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

const displayName = 'v5.common.SettingsRow.Container';

interface SettingsRowContainerProps extends PropsWithChildren {
  className?: string;
}

const SettingsRowContainer: FC<SettingsRowContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={clsx(
        'flex w-full flex-col items-start gap-6 border-b border-gray-200 pb-6',
        className,
      )}
    >
      {children}
    </div>
  );
};

SettingsRowContainer.displayName = displayName;
export default SettingsRowContainer;
