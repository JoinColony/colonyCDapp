import { formatText } from '~utils/intl.ts';

import { breadcrumbItemNames } from './consts.ts';

export const getBreadcrumbItemName = (parameter: string): string => {
  return breadcrumbItemNames[parameter]
    ? formatText(breadcrumbItemNames[parameter])
    : parameter;
};
