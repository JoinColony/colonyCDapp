import { type MemberItem } from '~frame/v5/pages/MembersPage/types.ts';
import { type EmptyContentProps } from '~v5/common/EmptyContent/types.ts';
import { type TextButtonProps } from '~v5/shared/Button/types.ts';

export interface MembersTabContentProps {
  items: MemberItem[];
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
