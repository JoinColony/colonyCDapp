import React, { type FC, type MutableRefObject } from 'react';
import { useVisible } from 'react-hooks-visible';

import { type TableRowProps, type VirtualizedRowProps } from './types.ts';

const VirtualizedRow: FC<VirtualizedRowProps> = ({
  children,
  className,
  itemHeight,
}) => {
  const [targetRef, isVisible] = useVisible((vi: number) => vi > 0.5);

  return (
    <tr
      className={className}
      ref={targetRef as MutableRefObject<HTMLTableRowElement>}
    >
      {isVisible ? (
        children
      ) : (
        <div style={{ width: '100%', height: itemHeight }} />
      )}
    </tr>
  );
};

export const TableRow: FC<TableRowProps> = ({
  children,
  className,
  isEnabled,
  itemHeight,
}) => {
  if (!isEnabled) {
    return <tr>{children}</tr>;
  }

  return (
    <VirtualizedRow itemHeight={itemHeight} className={className}>
      {children}
    </VirtualizedRow>
  );
};

export default VirtualizedRow;
