import React from 'react';

export const TableRowDivider = () => (
  <tr className="relative w-full [&:last-of-type]:hidden [&:not(last-child)>#divider-cell>div]:!py-0 [&:not(last-child)>#divider-cell]:!px-0 [&>#divider-cell]:!h-[1px]">
    <td colSpan={100} id="divider-cell">
      <div className="h-full w-full !py-0 px-4">
        <div className="border-b border-gray-100" />
      </div>
    </td>
  </tr>
);
