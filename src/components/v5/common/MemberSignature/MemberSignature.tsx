import React, { FC } from 'react';

import { useIntl } from 'react-intl';
import { MemberSignatureProps } from './types';
import AvatarUser from '~v5/shared/AvatarUser';

const displayName = 'v5.common.MemberSignature';

const MemberSignature: FC<MemberSignatureProps> = ({ isChecked, ...rest }) => {
  const { formatMessage } = useIntl();

  return (
    <div className="flex items-center justify-between gap-2">
      <AvatarUser {...rest} size="xs" />
      <span className="text-sm">
        {formatMessage({
          id: isChecked
            ? 'common.memberSignature.signed'
            : 'common.memberSignature.notSigned',
        })}
      </span>
    </div>
  );
};

MemberSignature.displayName = displayName;

export default MemberSignature;
