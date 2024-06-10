import { type GovernanceOptions } from '~frame/Extensions/pages/ExtensionsPage/types.ts';

import { defaultGovernanceOptions } from './consts.tsx';

export const getSelectedFormData = (governanceValue: GovernanceOptions) => {
  return defaultGovernanceOptions[governanceValue];
};
