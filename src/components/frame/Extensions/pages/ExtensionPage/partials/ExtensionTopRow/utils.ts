import { Extension } from '@colony/colony-js';

export const canSettingsBeUpdated = (extension: Extension) =>
  [Extension.StakedExpenditure].includes(extension);
