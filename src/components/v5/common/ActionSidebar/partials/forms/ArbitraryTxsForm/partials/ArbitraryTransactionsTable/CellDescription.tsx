import React, { type FC } from 'react';

interface CellDescriptionProps {
  data: {
    title: string;
    value: string;
  }[];
}

const CellDescription: FC<CellDescriptionProps> = ({ data }) => {
  return (
    <div>
      {data.map(({ title, value }) => {
        return (
          <span className="mb-3 flex flex-col">
            <span className="font-medium text-gray-900">{title}:</span>
            <span className="text-gray-600">{value}</span>
          </span>
        );
      })}
    </div>
  );
};
export default CellDescription;
