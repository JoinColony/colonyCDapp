import React, { FC, PropsWithChildren } from 'react';
import { SpinnerLoader } from '~shared/Preloaders';
import { ColonyDropdownMobileProps } from '../types';

const displayName = 'common.Extensions.partials.ColonyDropdownMobile';

const ColonyDropdownMobile: FC<
  PropsWithChildren<ColonyDropdownMobileProps>
> = ({ isOpen, userLoading, children }) => (
  <>
    {isOpen && (
      <div className="flex flex-col w-full pt-[5.5625rem] sm:pt-0">
        {userLoading && (
          <div className="flex justify-center">
            <SpinnerLoader appearance={{ size: 'medium' }} />
          </div>
        )}
        {children}
      </div>
    )}
  </>
);

ColonyDropdownMobile.displayName = displayName;

export default ColonyDropdownMobile;
