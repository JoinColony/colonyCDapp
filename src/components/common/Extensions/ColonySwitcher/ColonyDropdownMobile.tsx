import React, { FC, PropsWithChildren } from 'react';
import clsx from 'clsx';
import { SpinnerLoader } from '~shared/Preloaders';
import { IColonyDropdownMobile } from './types';

const displayName = 'common.Extensions.ColonyDropdownMobile';

const ColonyDropdownMobile: FC<PropsWithChildren<IColonyDropdownMobile>> = ({
  isOpen,
  isMobile,
  userLoading,
  children,
}) => (
  <>
    {isOpen && (
      <div className="h-auto absolute">
        <div
          className={clsx('h-[24.75rem] p-1 flex justify-center z-[9999] bg-base-white', {
            'w-[26.75rem]': isMobile,
          })}
        >
          {userLoading && (
            <div className="h-[24.75rem] p-1 flex justify-center">
              <SpinnerLoader appearance={{ size: 'medium' }} />
            </div>
          )}
          {children}
        </div>
      </div>
    )}
  </>
);

ColonyDropdownMobile.displayName = displayName;

export default ColonyDropdownMobile;
