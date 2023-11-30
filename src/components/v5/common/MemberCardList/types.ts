import { MemberCardProps } from '../MemberCard/types';
import { MemberCardPlaceholderProps } from './partials/MemberCardPlaceholder/types';

export interface MemberCardListItem extends Omit<MemberCardProps, 'isSimple'> {
  key: string;
}

export interface MemberCardListProps {
  items: MemberCardListItem[];
  placeholderCardProps?: MemberCardPlaceholderProps;
  isSimple?: boolean;
}
