import clsx from 'clsx';
import React, { type PropsWithChildren, type FC } from 'react';

interface ExpandableRowWrapperProps extends PropsWithChildren {
  row: any;
  showExpandableContent?: boolean;
  hasNarrowBorders?: boolean;
}

export const ExpandableRowWrapper: FC<ExpandableRowWrapperProps> = ({
  row,
  showExpandableContent,
  hasNarrowBorders,
  children,
}) => {
  return showExpandableContent ? (
    <tr
      className={clsx({
        '[&:not(:last-child)>td]:border-b [&:not(:last-child)>td]:border-gray-100':
          !hasNarrowBorders,
      })}
    >
      <td colSpan={row.getVisibleCells().length}>{children}</td>
    </tr>
  ) : null;
};
