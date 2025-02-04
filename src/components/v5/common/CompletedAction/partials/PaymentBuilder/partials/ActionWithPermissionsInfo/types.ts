import { type ExpenditureAction } from '~types/graphql.ts';

import type React from 'react';

export interface ActionWithPermissionsInfoProps {
  action?: ExpenditureAction | null;
  title?: string;
  additionalBadge?: React.ReactNode;
  isActionCancelled?: boolean;
  additionalInfo?: React.ReactNode;
}
