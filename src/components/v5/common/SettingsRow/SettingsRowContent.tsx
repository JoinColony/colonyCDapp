import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

const displayName = 'v5.common.SettingsRow.Content';

interface SettingsRowContentProps extends PropsWithChildren {
  rightContent?: JSX.Element;
  className?: string;
}

const SettingsRowContent: FC<SettingsRowContentProps> = ({
  children,
  rightContent,
  className,
}) => {
  return (
    <div className={clsx('flex w-full items-start justify-between', className)}>
      <div className="flex flex-col items-start gap-1 sm:w-1/2">{children}</div>
      {rightContent}
    </div>
  );
};

SettingsRowContent.displayName = displayName;
export default SettingsRowContent;
