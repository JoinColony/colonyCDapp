import React, { type FC, type MutableRefObject } from 'react';
import { useVisible } from 'react-hooks-visible';

import { type TableRowProps, type VirtualizedRowProps } from './types.ts';

/** @TODO refactor this to use @tanstack/react-virtual */
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
        <td style={{ width: 'auto', height: itemHeight }} />
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
    return <tr className={className}>{children}</tr>;
  }

  return (
    <VirtualizedRow itemHeight={itemHeight} className={className}>
      {children}
    </VirtualizedRow>
  );
};

export default VirtualizedRow;
