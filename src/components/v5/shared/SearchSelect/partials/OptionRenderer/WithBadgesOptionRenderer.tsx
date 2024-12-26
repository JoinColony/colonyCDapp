import React from 'react';

import { formatText } from '~utils/intl.ts';
import ExtensionsStatusBadge from '~v5/common/Pills/ExtensionStatusBadge/index.ts';
import { type WithBadgesOptionRendererProps } from '~v5/shared/SearchSelect/types.ts';

export const WithBadgesOptionRenderer: WithBadgesOptionRendererProps = (
  option,
  isLabelVisible,
) => {
  const { label, isComingSoon, isNew } = option;
  const labelText = formatText(label || '');

  return (
    <>
      {isLabelVisible && labelText}
      {isComingSoon && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 transform">
          <ExtensionsStatusBadge
            mode="coming-soon"
            text={formatText({ id: 'status.comingSoon' })}
          />
        </div>
      )}
      {isNew && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 transform">
          <ExtensionsStatusBadge
            mode="new"
            text={formatText({ id: 'status.new' })}
          />
        </div>
      )}
    </>
  );
};
