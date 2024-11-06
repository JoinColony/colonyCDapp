import React, { type ReactNode, type FC } from 'react';

interface CellDescriptionProps {
  data: {
    title: ReactNode;
    value: ReactNode;
  }[];
}

const CellDescription: FC<CellDescriptionProps> = ({ data }) => {
  return (
    <div className="w-full">
      {data.map(({ title, value }) => {
        return (
          <span key={`${title}-${value}`} className="mb-3 flex flex-col">
            <span className="font-medium text-gray-900">{title}:</span>
            <span className="truncate text-gray-600">{value}</span>
          </span>
        );
      })}
    </div>
  );
};
export default CellDescription;
