import React from 'react';

import { FieldState } from './consts';

export interface BaseFieldProps {
  state?: FieldState;
  message?: React.ReactNode;
  stateClassNames?: Partial<Record<FieldState, string>>;
}
