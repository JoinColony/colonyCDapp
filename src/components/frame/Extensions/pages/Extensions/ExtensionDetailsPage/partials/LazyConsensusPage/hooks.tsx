import { type GovernanceOptions } from '../../../ExtensionsListingPage/types.ts';

import { defaultGovernanceOptions } from './consts.tsx';

export const getSelectedFormData = (governanceValue: GovernanceOptions) => {
  return defaultGovernanceOptions[governanceValue];
};
