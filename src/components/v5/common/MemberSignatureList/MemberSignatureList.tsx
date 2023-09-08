import React, { FC } from 'react';

import { SpinnerLoader } from '~shared/Preloaders';
import MemberSignature from '../MemberSignature';
import { MemberSignatureListProps } from './types';

const displayName = 'v5.common.MemberSignatureList';

const MemberSignatureList: FC<MemberSignatureListProps> = ({
  items,
  isLoading,
  title,
}) => {
  const shouldShowList = !isLoading && !!items?.length;

  return (
    <div>
      <h3 className="text-1 mb-2">{title}</h3>
      {isLoading && (
        <div className="flex justify-center">
          <SpinnerLoader appearance={{ size: 'medium' }} />
        </div>
      )}
      {shouldShowList && (
        <ul>
          {items.map(({ isChecked, walletAddress, ...rest }) => (
            <li key={walletAddress} className="mb-3 last:mb-0">
              {/* @TODO: Implement signed/not signed state */}
              <MemberSignature
                {...rest}
                walletAddress={walletAddress}
                isChecked={isChecked}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

MemberSignatureList.displayName = displayName;

export default MemberSignatureList;
