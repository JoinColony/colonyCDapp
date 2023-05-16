import React, { FC, PropsWithChildren } from 'react';
import { TitledContentProps } from './types';

const TitledContent: FC<PropsWithChildren<TitledContentProps>> = ({ children, title, className }) => {
  return (
    <div className={className}>
      <h4 className="uppercase text-xs text-gray-400 font-medium font-inter mb-2">{title}</h4>
      {children}
    </div>
  );
};

export default TitledContent;
