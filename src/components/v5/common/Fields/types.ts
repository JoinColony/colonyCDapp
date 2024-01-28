import { type FieldState } from './consts.ts';

import type React from 'react';

export interface BaseFieldProps {
  state?: FieldState;
  message?: React.ReactNode;
  stateClassNames?: Partial<Record<FieldState, string>>;
}
