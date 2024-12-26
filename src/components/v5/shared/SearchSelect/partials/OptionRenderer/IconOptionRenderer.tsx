import React from 'react';

import { formatText } from '~utils/intl.ts';
import { type IconOptionRendererProps } from '~v5/shared/SearchSelect/types.ts';

export const IconOptionRenderer: IconOptionRendererProps = (
  option,
  isLabelVisible,
) => {
  const { icon: Icon, label } = option;
  const labelText = formatText(label || '');

  return (
    <>
      {Icon && <Icon size={20} className="mr-2" />}
      {isLabelVisible && labelText}
    </>
  );
};
