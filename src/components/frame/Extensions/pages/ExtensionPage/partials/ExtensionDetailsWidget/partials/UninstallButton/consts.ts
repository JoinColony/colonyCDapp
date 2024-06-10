import { Extension } from '@colony/colony-js';

export const uninstallDescriptionScheme = {
  [Extension.StakedExpenditure]:
    'Uninstalling this extension will remove the functionality to be able to create payments by staking. Ensure you understand the potential risks before continuing.',
};

export const uninstallDescriptionDefault =
  'Uninstalling this extension will permanently delete all actions associated with this extension from this Colony. Ensure you understand the potential risks before continuing.';

export const uninstallConfirmationScheme = {
  [Extension.StakedExpenditure]:
    'I understand that funds can be lost and are unrecoverable',
};

export const uninstallConfirmationDefault =
  'Uninstalling this extension will permanently delete all actions associated with this extension from this Colony. Ensure you understand the potential risks before continuing.';
