import { type ExpenditureAction } from '~types/graphql.ts';

export interface RequestsBoxProps {
  title: string;
  actions: ExpenditureAction[];
  onClick: (action: ExpenditureAction | null) => void;
  selectedAction: ExpenditureAction | null;
}

export interface RequestsBoxItemProps {
  action: ExpenditureAction;
  onClick: (action: ExpenditureAction | null) => void;
  selectedAction: ExpenditureAction | null;
  title?: string;
  isOnlyItem?: boolean;
}
