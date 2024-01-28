import { type MemberCardProps } from '../MemberCard/types.ts';

import { type MemberCardPlaceholderProps } from './partials/MemberCardPlaceholder/types.ts';

export interface MemberCardListItem extends Omit<MemberCardProps, 'isSimple'> {
  key: string;
}

export interface MemberCardListProps {
  items: MemberCardListItem[];
  placeholderCardProps?: MemberCardPlaceholderProps;
  isSimple?: boolean;
}
