import React, { FC, PropsWithChildren } from 'react';
import { SpinnerLoader } from '~shared/Preloaders';
import { ColonyDropdownMobileProps } from '../types';

const displayName = 'common.Extensions.partials.ColonyDropdownMobile';

const ColonyDropdownMobile: FC<PropsWithChildren<ColonyDropdownMobileProps>> = ({ isOpen, userLoading, children }) => (
  <>
    {isOpen && (
      <div className="h-auto absolute left-[-1.5rem] bg-base-white">
        <div className="h-[24.75rem] flex justify-center z-[9999] bg-base-white md:w-full w-screen">
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
