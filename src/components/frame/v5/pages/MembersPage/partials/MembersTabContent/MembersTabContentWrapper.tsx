import clsx from 'clsx';
import React, { FC, PropsWithChildren } from 'react';

import { MembersTabContentWrapperProps } from './types.ts';

const MembersTabContentWrapper: FC<
  PropsWithChildren<MembersTabContentWrapperProps>
> = ({ title, titleAction, description, additionalActions, children }) => {
  const titleContent = titleAction ? (
    <div className="flex items-center gap-2">
      <h2 className="heading-4 text-gray-900">{title}</h2>
      <div className="flex-shrink-0 flex justify-center items-center">
        {titleAction}
      </div>
    </div>
  ) : (
    <h2 className="heading-4 text-gray-900">{title}</h2>
  );

  return (
    <div className="pt-2">
      <div
        className={clsx('w-full mb-6 flex flex-col', {
          'gap-4 sm:gap-1': additionalActions,
          'gap-2': !additionalActions,
        })}
      >
        {additionalActions ? (
          <div className="w-full flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            {titleContent}
            <div className="flex-shrink-0">{additionalActions}</div>
          </div>
        ) : (
          titleContent
        )}
        <p className="text-md text-gray-600">{description}</p>
      </div>
      {children}
    </div>
  );
};

export default MembersTabContentWrapper;
