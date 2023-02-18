import React from 'react';

import ColorTag from '~shared/ColorTag';
import { DomainColor } from '~types';
import { formatText } from '~utils/intl';

export const getDomainMetadataValues = (
  values: string,
  color?: DomainColor,
) => {
  return formatText(
    {
      id: 'domainMetadata.newValues',
      defaultMessage: `{values}{color}`,
    },
    {
      values,
      color: color && <ColorTag color={color} />,
    },
  );
};
