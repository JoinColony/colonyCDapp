import { EmptyContentProps } from '~v5/common/EmptyContent/types.ts';
import { MemberCardListItem } from '~v5/common/MemberCardList/types.ts';
import { TextButtonProps } from '~v5/shared/Button/types.ts';

export type MembersTabContentListItem = Omit<
  MemberCardListItem,
  'meatBallMenuProps'
>;

export interface MembersTabContentProps {
  items: MembersTabContentListItem[];
  withSimpleCards?: boolean;
  isLoading?: boolean;
  loadMoreButtonProps?: TextButtonProps;
  contentClassName?: string;
  emptyContentProps?: EmptyContentProps;
}

export interface MembersTabContentWrapperProps {
  title: string;
  titleAction?: React.ReactNode;
  description: string;
  additionalActions?: React.ReactNode;
}
