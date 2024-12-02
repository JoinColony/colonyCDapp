import clsx from 'clsx';
import React from 'react';

import { TableRowDivider } from '../TableRowDivider.tsx';
import { TableRow } from '../VirtualizedRow/VirtualizedRow.tsx';

import { HorizontalTableCell } from './HorizontalTableCell.tsx';
import { HorizontalTableHeader } from './HorizontalTableHeader.tsx';
import { type HorizontalLayoutProps } from './types.ts';

export const HorizontalLayout = <T,>({
  rows,
  headerGroups,
  showTableHead,
  emptyContent,
  totalColumnsCount,
  getRowClassName,
  withBorder,
  sizeUnit,
  virtualizedProps,
  renderSubComponent,
  getMenuProps,
  tableBodyRowKeyProp,
  withNarrowBorder,
  renderCellWrapper,
  isDisabled,
  data,
}: HorizontalLayoutProps<T>) => {
  const shouldShowEmptyContent = !!emptyContent && data.length === 0;

  const getTableCellStyle = (index: number) =>
    !showTableHead
      ? {
          width:
            headerGroups[0].headers[index].column.columnDef.staticSize ||
            (headerGroups[0].headers[index].getSize() !== 150
              ? `${headerGroups[0].headers[index].column.getSize()}${sizeUnit}`
              : undefined),
        }
      : undefined;

  return (
    <>
      {showTableHead && (
        <HorizontalTableHeader
          groups={headerGroups}
          disabled={shouldShowEmptyContent}
          sizeUnit={sizeUnit}
        />
      )}
      <tbody className="w-full">
        {shouldShowEmptyContent ? (
          <tr className="[&:not(:last-child)>td]:border-b [&:not(:last-child)>td]:border-gray-100">
            <td colSpan={totalColumnsCount} className="h-full">
              <div className="flex flex-col items-start justify-center px-[1.1rem] py-4 text-md text-gray-500">
                {emptyContent}
              </div>
            </td>
          </tr>
        ) : (
          rows.map((row) => {
            const showExpandableContent =
              row.getIsExpanded() && renderSubComponent;

            const rowKey = tableBodyRowKeyProp
              ? data[row.index]?.[tableBodyRowKeyProp]
              : null;

            const key =
              typeof rowKey === 'string' || typeof rowKey === 'number'
                ? rowKey
                : row.id;

            return (
              <React.Fragment key={key}>
                <TableRow
                  itemHeight={virtualizedProps?.virtualizedRowHeight || 0}
                  isEnabled={!!virtualizedProps}
                  className={clsx(getRowClassName(row), {
                    'translate-z-0 relative [&>tr:first-child>td]:pr-9 [&>tr:last-child>td]:p-0 [&>tr:last-child>th]:p-0':
                      getMenuProps,
                    '[&:not(:last-child)>td]:border-b [&:not(:last-child)>td]:border-gray-100':
                      (!showExpandableContent &&
                        row.getCanExpand() &&
                        !withNarrowBorder) ||
                      withBorder,
                    'expanded-below': showExpandableContent,
                  })}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <HorizontalTableCell
                      key={`${key}-${cell?.id || index}`}
                      style={getTableCellStyle(index)}
                      row={row}
                      cell={cell}
                      renderCellWrapper={renderCellWrapper}
                      isDisabled={isDisabled}
                    />
                  ))}
                </TableRow>
                {showExpandableContent && (
                  <tr
                    className={clsx({
                      '[&:not(:last-child)>td]:border-b [&:not(:last-child)>td]:border-gray-100':
                        !withNarrowBorder,
                    })}
                  >
                    <td colSpan={row.getVisibleCells().length}>
                      {renderSubComponent({ row })}
                    </td>
                  </tr>
                )}
                {
                  /** Unfortunately Safari is not yet that friendly to allow the usage of absolutely positioned (pseudo)-element inside tables
                   * So, for the moment, this is our best shot for showing borders with paddings from the tr margins
                   */
                  withNarrowBorder && <TableRowDivider />
                }
              </React.Fragment>
            );
          })
        )}
      </tbody>
    </>
  );
};
