import { CheckCircle, WarningCircle, XCircle } from '@phosphor-icons/react';
import React from 'react';

interface StatusCircleProps {
  status?: 'success' | 'warn' | 'error';
  size: number;
}

const StatusCircle = ({ status, size }: StatusCircleProps) => {
  switch (status) {
    case 'error':
      return <XCircle size={size} />;
    case 'warn':
      return <WarningCircle size={size} />;
    default:
      return <CheckCircle size={size} />;
  }
};

StatusCircle.displayName = 'shared.StatusCircle';

export default StatusCircle;
