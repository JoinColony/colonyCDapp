import { type NetworkInfo } from '~constants/index.ts';

import type React from 'react';

export interface NetworkNameProps {
  networkInfo: NetworkInfo;
  size?: number;
  error?: boolean;
  errorMessage?: React.ReactNode;
}
