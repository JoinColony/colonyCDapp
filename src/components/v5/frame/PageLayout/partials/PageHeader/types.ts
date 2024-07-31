import { type ColonyContextValue } from '~context/ColonyContext/ColonyContext.ts';

import { type PageHeadingProps } from '../PageHeading/types.ts';

export interface PageHeaderProps {
  pageHeadingProps?: PageHeadingProps;
  className?: string;
  colonyContext?: ColonyContextValue;
}
