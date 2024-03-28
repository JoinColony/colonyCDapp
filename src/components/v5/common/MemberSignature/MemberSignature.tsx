import React, { type FC } from 'react';
import { useIntl } from 'react-intl';

import MemberAvatar from './partials/MemberAvatar/MemberAvatar.tsx';
import { type MemberSignatureProps } from './types.ts';

const displayName = 'v5.common.MemberSignature';

const MemberSignature: FC<MemberSignatureProps> = ({ hasSigned, children }) => {
  const { formatMessage } = useIntl();

  return (
    <div className="flex items-center justify-between gap-2">
      <MemberAvatar>{children}</MemberAvatar>
      <span className="text-sm">
        {formatMessage({
          id: hasSigned
            ? 'common.memberSignature.signed'
            : 'common.memberSignature.notSigned',
        })}
      </span>
    </div>
  );
};

MemberSignature.displayName = displayName;

export default MemberSignature;
