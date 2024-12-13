import React from 'react';

import { useCollapseRows } from '~v5/common/Table/hooks.ts';
import { ExpandableRowWrapper } from '~v5/common/Table/partials/ExpandableRowWrapper.tsx';
import { HorizontalTableCell } from '~v5/common/Table/partials/TableLayout/HorizontalTableCell.tsx';
import { HorizontalTableHeader } from '~v5/common/Table/partials/TableLayout/HorizontalTableHeader.tsx';
import { TableRowDivider } from '~v5/common/Table/partials/TableRowDivider.tsx';
import { TableRow } from '~v5/common/Table/partials/VirtualizedRow/VirtualizedRow.tsx';
import { type HorizontalTableLayoutProps } from '~v5/common/Table/types.ts';
import {
  getHorizontalRowClasses,
  getHorizontalRowKey,
  renderEmptyContent,
} from '~v5/common/Table/utils.tsx';

export const HorizontalTableLayout = <T,>({
  showTableHead,
  emptyContent,
  moreActions,
  rows: rowsConfig,
  borders,
  renderCellWrapper,
  isDisabled,
  data,
  table,
}: HorizontalTableLayoutProps<T>) => {
  const { rows } = table.getRowModel();
  const headerGroups = table.getHeaderGroups();
  const totalColumnsCount = table.getVisibleFlatColumns().length;
  const shouldShowEmptyContent = !!emptyContent && data.length === 0;
  const hasNarrowBorders = borders?.type === 'narrow';
  const hasWideBorders = borders?.type === 'wide';
  const hasMoreActions = !!moreActions;
  useCollapseRows(rows, table.getIsSomeRowsExpanded());

  const getTableCellStyle = (index: number) =>
    !showTableHead
      ? {
          width:
            headerGroups[0].headers[index].column.columnDef.staticSize ||
            (headerGroups[0].headers[index].column.getSize() !== 150
              ? `${headerGroups[0].headers[index].column.getSize()}px`
              : undefined),
        }
      : undefined;

  return (
    <>
      {showTableHead && (
        <HorizontalTableHeader
          groups={headerGroups}
          disabled={shouldShowEmptyContent}
        />
      )}
      <tbody className="w-full">
        {renderEmptyContent({
          shouldShowEmptyContent,
          emptyContent,
          colSpan: totalColumnsCount,
        }) ||
          rows.map((row) => {
            const renderSubComponent = rowsConfig?.renderSubComponent;
            const showExpandableContent =
              row.getIsExpanded() && !!renderSubComponent;

            const key = getHorizontalRowKey({
              row,
              rowKeyProp: rowsConfig?.key,
              data,
            });

            return (
              <React.Fragment key={key}>
                <TableRow
                  itemHeight={rowsConfig?.virtualizedRowHeight ?? 0}
                  isEnabled={rowsConfig?.virtualizedRowHeight !== undefined}
                  className={getHorizontalRowClasses({
                    className: rowsConfig?.getRowClassName?.(row),
                    isExpandable: row.getCanExpand(),
                    showExpandableContent,
                    hasWideBorders,
                    hasNarrowBorders,
                    hasMoreActions,
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
                <ExpandableRowWrapper
                  row={row}
                  showExpandableContent={showExpandableContent}
                  hasNarrowBorders={hasNarrowBorders}
                >
                  {renderSubComponent?.({ row })}
                </ExpandableRowWrapper>
                {
                  /**
                   * Unfortunately Safari is not yet that friendly to allow the usage of absolutely positioned (pseudo)-element inside tables
                   * So, for the moment, this is our best shot for showing borders with paddings from the tr margins
                   */
                  hasNarrowBorders && <TableRowDivider />
                }
              </React.Fragment>
            );
          })}
      </tbody>
    </>
  );
};
