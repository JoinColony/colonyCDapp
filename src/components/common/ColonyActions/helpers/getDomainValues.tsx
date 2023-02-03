import React from 'react';

import ColorTag from '~shared/ColorTag';
import { DomainColor } from '~gql';
import { graphQlDomainColorMap } from '~types';
import { formatText } from '~utils/intl';

export const getNewDomainMetadataValues = (
  newValues: string,
  newColor?: DomainColor,
) => {
  return formatText(
    {
      id: 'domainMetadata.newValues',
      defaultMessage: `{newValues}{newColor}`,
    },
    {
      newValues,
      newColor: newColor && (
        <ColorTag color={graphQlDomainColorMap[newColor]} />
      ),
    },
  );
};

export const getOldDomainMetadataValues = (
  oldValues: string,
  oldColor?: DomainColor,
) =>
  formatText(
    {
      id: 'domainMetadata.oldValues',
      defaultMessage: `{oldValues}{oldColor}`,
    },
    {
      oldValues,
      oldColor: oldColor && (
        <ColorTag color={graphQlDomainColorMap[oldColor]} />
      ),
    },
  );
