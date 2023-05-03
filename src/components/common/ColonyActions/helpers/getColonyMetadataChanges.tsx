import React from 'react';

import { Colony, ColonyAction, SimpleMessageValues } from '~types';
import { formatText } from '~utils/intl';

export const getColonyMetadataChangesValue = (
  { transactionHash }: ColonyAction,
  colony?: Colony,
) => {
  const {
    newDisplayName,
    oldDisplayName,
    hasAvatarChanged,
    hasWhitelistChanged,
  } =
    colony?.metadata?.changelog?.find(
      (item) => item.transactionHash === transactionHash,
    ) || {};

  const hasNameChanged =
    oldDisplayName && newDisplayName && newDisplayName !== oldDisplayName;

  const hasNoChanges =
    !hasNameChanged && !hasAvatarChanged && !hasWhitelistChanged;

  if (!colony || hasNoChanges) {
    return formatText({
      id: 'colonyMetadata.fallback',
      defaultMessage: 'metadata, but the values are the same',
    });
  }

  if (hasWhitelistChanged) {
    return formatText({
      id: 'colonyMetadata.change',
      defaultMessage: 'address book',
    });
  }

  const changeValues: SimpleMessageValues[] = [];
  if (hasNameChanged) {
    changeValues.push({
      property: 'name',
      oldValue: oldDisplayName,
      newValue: newDisplayName,
    });
  }
  if (hasAvatarChanged) {
    changeValues.push({
      property: 'logo',
      oldValue: null,
      newValue: null,
    });
  }

  return changeValues.map((values, index) => (
    <>
      {formatText(
        {
          id: 'colonyMetadata.change',
          defaultMessage: `{property} {oldValue, select, 
            null {}
            other {from {oldValue} to {newValue}}
          }`,
        },
        values,
      )}
      {index < changeValues.length - 2 && ', '}
      {index === changeValues.length - 2 && ' and its '}
    </>
  ));
};
