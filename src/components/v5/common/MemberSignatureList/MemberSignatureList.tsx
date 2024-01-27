import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { SpinnerLoader } from '~shared/Preloaders/index.ts';

import MemberSignature from '../MemberSignature/index.ts';

import { MemberSignatureListProps } from './types.ts';

const displayName = 'v5.common.MemberSignatureList';

const MemberSignatureList: FC<MemberSignatureListProps> = ({
  items,
  isLoading,
  title,
}) => {
  const { formatMessage } = useIntl();

  return (
    <div>
      <h3 className="text-1 mb-2">{title}</h3>
      {isLoading ? (
        <div className="flex justify-center">
          <SpinnerLoader appearance={{ size: 'medium' }} />
        </div>
      ) : (
        <>
          {items?.length ? (
            <ul>
              {items.map(({ hasSigned, avatarProps, key }) => (
                <li key={key} className="mb-3 last:mb-0">
                  <MemberSignature
                    avatarProps={avatarProps}
                    hasSigned={hasSigned}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">
              {formatMessage({ id: 'common.memberSignatureList.empty' })}
            </p>
          )}
        </>
      )}
    </div>
  );
};

MemberSignatureList.displayName = displayName;

export default MemberSignatureList;
