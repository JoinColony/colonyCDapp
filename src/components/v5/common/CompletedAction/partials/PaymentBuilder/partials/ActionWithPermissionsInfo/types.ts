import { type ExpenditureAction } from '~types/graphql.ts';

export interface ActionWithPermissionsInfoProps {
  action?: ExpenditureAction | null;
  title?: string;
}
