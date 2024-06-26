import React, { type FC, type PropsWithChildren } from 'react';

export const FormRow: FC<PropsWithChildren> = ({ children }) => {
  return <div className="py-1 pb-3">{children}</div>;
};
