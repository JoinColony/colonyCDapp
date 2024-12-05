import React, { type ReactNode, type FC } from 'react';

export interface CellDescriptionItem {
  name: ReactNode;
  value: ReactNode;
}
interface CellDescriptionProps {
  data: CellDescriptionItem[];
}

const CellDescription: FC<CellDescriptionProps> = ({ data }) => {
  return (
    <div className="w-full">
      {data.map(({ name, value }) => {
        return (
          <span key={`${name}-${value}`} className="mb-3 flex flex-col">
            <span className="font-medium text-gray-900">{name}:</span>
            <span className="truncate text-gray-600">{value}</span>
          </span>
        );
      })}
    </div>
  );
};
export default CellDescription;
