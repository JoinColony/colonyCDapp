import React, { type PropsWithChildren, type FC } from 'react';

export const GroupedActionList: FC<PropsWithChildren> = ({ children }) => {
  return (
    <section className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
      {children}
    </section>
  );
};
