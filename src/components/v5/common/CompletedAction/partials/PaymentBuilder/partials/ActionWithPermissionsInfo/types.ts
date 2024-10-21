import { type ExpenditureAction } from '~types/graphql.ts';

import type React from 'react';

export interface ActionWithPermissionsInfoProps {
  title?: string;
  action?: ExpenditureAction | null;
  title?: string;
  additionalBadge?: React.ReactNode;
  isActionCancelled?: boolean;
  additionalInfo?: React.ReactNode;
}
