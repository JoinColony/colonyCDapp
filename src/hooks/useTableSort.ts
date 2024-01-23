import { useState } from 'react';

export enum TableSortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface TableSort<F> {
  field: F;
  direction: TableSortDirection;
}

interface UseTableSortResult<F> {
  handleSortFieldClick: (field: F) => void;
  sort: TableSort<F> | null;
}

const useTableSort = <F>(): UseTableSortResult<F> => {
  const [sort, setSort] = useState<TableSort<F> | null>(null);

  const handleSortFieldClick = (field: F) => {
    if (sort !== null && sort.field === field) {
      if (sort.direction === TableSortDirection.ASC) {
        setSort({
          field,
          direction: TableSortDirection.DESC,
        });
      } else {
        setSort(null);
      }
    } else {
      setSort({
        field,
        direction: TableSortDirection.ASC,
      });
    }
  };

  return {
    sort,
    handleSortFieldClick,
  };
};

export default useTableSort;
