import { type PropsWithChildren } from 'react';

import { type MemberCardPlaceholderProps } from './partials/MemberCardPlaceholder/types.ts';

export type MemberCardListProps = PropsWithChildren<{
  placeholderCardProps?: MemberCardPlaceholderProps;
  isSimple?: boolean;
}>;
