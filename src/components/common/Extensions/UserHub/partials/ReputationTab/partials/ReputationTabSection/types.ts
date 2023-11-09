import { ButtonProps } from '~v5/shared/Button/types';

export interface ReputationTabSectionActionItem extends ButtonProps {
  key: string;
}

export interface ReputationTabSectionItem {
  title: string;
  actions?: ReputationTabSectionActionItem[];
  value: React.ReactNode;
  key: string;
}

export interface ReputationTabSectionProps {
  title: string;
  additionalHeadingContent?: React.ReactNode;
  items: ReputationTabSectionItem[];
  className?: string;
}
