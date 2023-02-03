import { DomainColor } from '~gql';
import { Domain, Falsy } from '~types';
import { convertToCapitalized } from './strings';

interface ColonyMetadataChanges {
  nameChanged: boolean;
  logoChanged: boolean;
  tokensChanged: boolean;
  verifiedAddressesChanged: boolean;
}

type DomainMetadata = Pick<Domain, 'color' | 'name' | 'description'>;

export const getColonyMetadataMessageValues = (
  metadataChanges: Partial<ColonyMetadataChanges>,
  colonyName?: string,
) => {
  if (!colonyName) {
    return undefined;
  }

  /*
   * I'm imagining we will either maintain a history of metadata changes in the db so these can be determined on the client,
   * or keep a "changed" property on the model that gets updated every time metadata changes, so you know exactly what changed.
   * E.g. { changed: ['name', 'logo'] / ['tokens'] }
   */
  const { nameChanged, logoChanged, tokensChanged, verifiedAddressesChanged } =
    metadataChanges;

  let colonyMetadata = '';
  let colonyMetadataChange = '';
  let changed = 'changed';

  if (nameChanged) {
    colonyMetadata = 'name';
    colonyMetadataChange = ` to ${colonyName}`;
    if (logoChanged) {
      colonyMetadataChange += ' and its logo';
    }
  } else if (logoChanged) {
    colonyMetadata = 'logo';
  } else if (tokensChanged) {
    colonyMetadata = 'tokens';
  } else if (verifiedAddressesChanged) {
    changed = 'updated';
    colonyMetadata = 'address book';
  } else {
    colonyMetadata = 'metadata';
    colonyMetadataChange = ', but the values are the same';
  }

  return {
    changed,
    colonyMetadata,
    colonyMetadataChange,
  };
};

const getDomainMetadataValue = (
  nameChanged: boolean,
  descriptionChanged: boolean,
  colorChanged: boolean,
) => {
  const metadataChanges: string[] = [];
  let domainMetadata = "'s ";
  if (nameChanged) {
    metadataChanges.push('name');
  }

  if (descriptionChanged) {
    metadataChanges.push('description');
  }

  if (colorChanged) {
    metadataChanges.push('color');
  }

  switch (metadataChanges.length) {
    case 1: {
      domainMetadata += metadataChanges.join('');
      break;
    }
    case 2: {
      domainMetadata += metadataChanges.join(' and ');
      break;
    }
    case 3: {
      metadataChanges.splice(1, 0, ', ');
      metadataChanges.splice(3, 0, ' and ');
      domainMetadata += metadataChanges.join('');
      break;
    }
    default: {
      domainMetadata = '';
      break;
    }
  }

  return domainMetadata;
};

const isDomainColor = (color: string): color is DomainColor =>
  convertToCapitalized(color) in DomainColor;

const getDomainMetadataValues = (
  values: (string | Falsy)[],
  direction: 'from' | 'to',
) => {
  const fallback = direction === 'from' ? ', but the values are the same' : '';
  const vals = values.filter(Boolean) as string[];
  const color = vals.find(isDomainColor);
  let restValuesFormatted = fallback;

  if (vals.length) {
    const restValues = vals.filter((val) => !isDomainColor(val));

    if (restValues.length) {
      restValuesFormatted = ` ${direction} `;
      restValuesFormatted += restValues.join(', ');
      if (color) {
        restValuesFormatted += ', and ';
      }
    }
  }

  return {
    values: restValuesFormatted,
    color,
  };
};

export const getDomainMetadataTitleValues = (
  {
    name: oldName,
    description: oldDescription,
    color: oldColor,
  }: DomainMetadata,
  {
    name: newName,
    description: newDescription,
    color: newColor,
  }: DomainMetadata,
) => {
  const nameChanged = oldName !== newName;
  const descriptionChanged = oldDescription !== newDescription;
  const colorChanged = oldColor !== newColor;
  const domainMetadataChanged = getDomainMetadataValue(
    nameChanged,
    descriptionChanged,
    colorChanged,
  );

  const oldDomainMetadata = getDomainMetadataValues(
    [
      nameChanged && oldName,
      descriptionChanged && oldDescription,
      colorChanged && oldColor,
    ],
    'from',
  );

  const newDomainMetadata = getDomainMetadataValues(
    [
      nameChanged && newName,
      descriptionChanged && newDescription,
      colorChanged && newColor,
    ],
    'to',
  );

  return {
    domainMetadataChanged,
    oldDomainMetadata,
    newDomainMetadata,
  };
};

export const getColonyRoleSetTitleValues = (setTo: boolean) => {
  return {
    roleSetAction: setTo ? 'assigned' : 'removed',
    roleSetDirection: setTo ? 'to' : 'from',
  };
};
