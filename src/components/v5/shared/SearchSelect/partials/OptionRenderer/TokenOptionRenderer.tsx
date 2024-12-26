import React from 'react';

import { formatText } from '~utils/intl.ts';
import { type TokenOptionRendererProps } from '~v5/shared/SearchSelect/types.ts';
import { TokenAvatar } from '~v5/shared/TokenAvatar/TokenAvatar.tsx';

export const TokenOptionRenderer: TokenOptionRendererProps = (
  option,
  isLabelVisible,
) => {
  const { token, label } = option;
  const labelText = formatText(label || '');

  return (
    <>
      {!!token && (
        <div className="mr-2">
          <TokenAvatar
            size={18}
            tokenName={token.name}
            tokenAddress={token.tokenAddress}
            tokenAvatarSrc={token.avatar ?? undefined}
          />
        </div>
      )}
      {isLabelVisible && labelText}
    </>
  );
};
