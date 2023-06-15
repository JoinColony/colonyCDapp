import React, { FC, PropsWithChildren } from 'react';
import { SpinnerLoader } from '~shared/Preloaders';
import { ColonyDropdownMobileProps } from '../types';

const displayName = 'common.Extensions.partials.ColonyDropdownMobile';

const ColonyDropdownMobile: FC<
  PropsWithChildren<ColonyDropdownMobileProps>
> = ({ isOpen, userLoading, children }) => (
  <>
    {isOpen && (
      <div className="h-auto bg-base-white">
        <div className="flex flex-col z-[9999] bg-base-white md:w-full w-screen">
          {userLoading && (
            <div className="flex justify-center">
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
