import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import { type MembersTabContentWrapperProps } from './types.ts';

const MembersTabContentWrapper: FC<
  PropsWithChildren<MembersTabContentWrapperProps>
> = ({ title, titleAction, description, additionalActions, children }) => {
  const titleContent = titleAction ? (
    <div className="flex items-center gap-2">
      <h2 className="text-gray-900 heading-4">{title}</h2>
      <div className="flex flex-shrink-0 items-center justify-center">
        {titleAction}
      </div>
    </div>
  ) : (
    <h2 className="text-gray-900 heading-4">{title}</h2>
  );

  return (
    <>
      <div
        className={clsx('mb-6 flex w-full flex-col', {
          'gap-4 sm:gap-1': additionalActions,
          'gap-2': !additionalActions,
        })}
      >
        {additionalActions ? (
          <div className="flex w-full flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            {titleContent}
            <div className="flex-shrink-0">{additionalActions}</div>
          </div>
        ) : (
          titleContent
        )}
        <p className="text-md text-gray-600">{description}</p>
      </div>
      {children}
    </>
  );
};

export default MembersTabContentWrapper;
