import { type ExpenditureAction } from '~types/graphql.ts';

export interface ActionWithPermissionsInfoProps {
  title?: string;
  action?: ExpenditureAction | null;
}
