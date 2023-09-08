import React, { FC } from 'react';

import { SpinnerLoader } from '~shared/Preloaders';
import MemberSignature from '../MemberSignature';
import { MemberSignatureListProps } from './types';

const displayName = 'v5.common.MemberSignatureList';

const MemberSignatureList: FC<MemberSignatureListProps> = ({
  items,
  isLoading,
  title,
}) => (
  <div>
    <h3 className="text-1 mb-2">{title}</h3>
    {isLoading && (
      <div className="flex justify-center">
        <SpinnerLoader appearance={{ size: 'medium' }} />
      </div>
    )}
    {!isLoading && !!items?.length && (
      <ul>
        {items.map(({ isChecked, walletAddress, ...item }) => (
          <li key={walletAddress} className="mb-3 last:mb-0">
            <MemberSignature
              {...item}
              walletAddress={walletAddress}
              isChecked={isChecked}
            />
          </li>
        ))}
      </ul>
    )}
  </div>
);

MemberSignatureList.displayName = displayName;

export default MemberSignatureList;
