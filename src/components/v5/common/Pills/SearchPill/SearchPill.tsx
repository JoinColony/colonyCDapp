import { X } from '@phosphor-icons/react';
import React, { type FC } from 'react';

interface SearchPillProps {
  value?: string;
  onClick: () => void;
}

const SearchPill: FC<SearchPillProps> = ({ value, onClick }) => {
  if (!value) {
    return null;
  }

  return (
    <div className="flex items-center justify-end rounded-lg bg-blue-100 px-3 py-2 text-sm text-blue-400">
      <p className="max-w-[12.5rem] truncate sm:max-w-full">{value}</p>
      <button type="button" onClick={onClick} className="ml-2 flex-shrink-0">
        <X size={12} className="text-inherit" />
      </button>
    </div>
  );
};

export default SearchPill;
