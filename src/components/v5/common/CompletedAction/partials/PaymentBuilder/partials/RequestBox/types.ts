import { type ColonyMotion } from '~types/graphql.ts';

import { type RequestBoxItemProps } from './partials/types.ts';

export interface RequestBoxItem extends RequestBoxItemProps {
  key: string;
}

export interface RequestBoxProps {
  title: string;
  motions: ColonyMotion[];
  withoutPadding?: boolean;
}
