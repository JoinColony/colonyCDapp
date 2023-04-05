import React from 'react';

import ColorTag from '~shared/ColorTag';
import { AnyMessageValues, ColonyAction } from '~types';
import { formatText } from '~utils/intl';

export const getDomainMetadataChangesValue = ({ fromDomain: domain, transactionHash }: ColonyAction) => {
  const { newName, oldName, newColor, oldColor, newDescription, oldDescription } =
    domain?.metadata?.changelog?.find((item) => item.transactionHash === transactionHash) || {};

  const hasNameChanged = oldName && newName && newName !== oldName;
  const hasColorChanged = oldColor && newColor && newColor !== oldColor;
  const hasDescriptionChanged = oldDescription && newDescription && newDescription !== oldDescription;
  const hasNoChanges = !hasNameChanged && !hasColorChanged && !hasDescriptionChanged;

  if (!domain || hasNoChanges) {
    return formatText({
      id: 'domainMetadata.fallback',
      defaultMessage: 'metadata, but the values are the same',
    });
  }

  const changeValues: AnyMessageValues[] = [];
  if (hasNameChanged) {
    changeValues.push({
      property: 'name',
      oldValue: oldName,
      newValue: newName,
    });
  }
  if (hasDescriptionChanged) {
    changeValues.push({
      property: 'description',
      oldValue: oldDescription,
      newValue: newDescription,
    });
  }
  if (hasColorChanged) {
    changeValues.push({
      property: 'color',
      oldValue: <ColorTag color={oldColor} />,
      newValue: <ColorTag color={newColor} />,
    });
  }

  return changeValues.map((values, index) => (
    <>
      {formatText(
        {
          id: 'domainMetadata.change',
          defaultMessage: '{property} from {oldValue} to {newValue}',
        },
        values,
      )}
      {index < changeValues.length - 1 && ', '}
    </>
  ));
};
