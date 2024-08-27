import React, { type PropsWithChildren, type FC, type ReactNode } from 'react';

interface GroupedActionListProps {
  title?: ReactNode | string;
}

export const GroupedActionList: FC<
  PropsWithChildren<GroupedActionListProps>
> = ({ children, title }) => {
  return (
    <>
      {!!title && <h3 className="py-2 heading-5">{title}</h3>}
      <section className="grid grid-cols-1 gap-4 py-2 pb-4 sm:grid-cols-2">
        {children}
      </section>
    </>
  );
};
