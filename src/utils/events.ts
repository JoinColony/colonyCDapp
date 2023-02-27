interface ColonyMetadataChanges {
  nameChanged: boolean;
  logoChanged: boolean;
  tokensChanged: boolean;
  verifiedAddressesChanged: boolean;
}

export const getColonyMetadataMessageValues = (
  metadataChanges: Partial<ColonyMetadataChanges>,
  colonyName?: string,
) => {
  if (!colonyName) {
    return undefined;
  }

  /*
   * TODO: Update the following to account for metadata changes being kept in the model as an array of changes,
   * with the latest one being the most recent one. Including domain functions below.
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

export const getColonyRoleSetTitleValues = (setTo: boolean) => ({
  roleSetAction: setTo ? 'assigned' : 'removed',
  roleSetDirection: setTo ? 'to' : 'from',
});
