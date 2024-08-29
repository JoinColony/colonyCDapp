import React, { type FC, type PropsWithChildren } from 'react';

export const WidgetCardsList: FC<PropsWithChildren> = ({ children }) => {
  return (
    <section className="flex w-full flex-col flex-wrap items-center gap-[1.125rem] sm:flex-row">
      {children}
    </section>
  );
};
