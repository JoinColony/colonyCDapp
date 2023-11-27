import { GovernanceOptions } from '../ExtensionsPage/types';
import { defaultGovernanceOptions } from './consts';

export const getSelectedFormData = (governanceValue: GovernanceOptions) => {
  return defaultGovernanceOptions[governanceValue];
};
