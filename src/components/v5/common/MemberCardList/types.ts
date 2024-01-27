import { MemberCardProps } from '../MemberCard/types.ts';

import { MemberCardPlaceholderProps } from './partials/MemberCardPlaceholder/types.ts';

export interface MemberCardListItem extends Omit<MemberCardProps, 'isSimple'> {
  key: string;
}

export interface MemberCardListProps {
  items: MemberCardListItem[];
  placeholderCardProps?: MemberCardPlaceholderProps;
  isSimple?: boolean;
}
