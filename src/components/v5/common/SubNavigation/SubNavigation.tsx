import React, { type PropsWithChildren, useState, type FC } from 'react';

import useDetectClickOutside from '~hooks/useDetectClickOutside.ts';

import SubNavigationItem, {
  SubNavigationItems,
} from './partials/SubNavigationItem/index.ts';

const displayName = 'v5.common.SubNavigation';

const SubNavigation: FC<PropsWithChildren> = () => {
  const [openIndex, setOpenIndex] = useState<number>();

  const ref = useDetectClickOutside({
    onTriggered: () => setOpenIndex(undefined),
  });

  return (
    <ul className="flex gap-8 heading-5 text-gray-700" ref={ref}>
      {SubNavigationItems.map(({ id, label, content, icon }) => (
        <SubNavigationItem
          key={id}
          id={id}
          label={label}
          content={content}
          icon={icon}
          isOpen={openIndex === id}
          setOpen={() =>
            setOpenIndex((prevState) => (prevState === id ? undefined : id))
          }
        />
      ))}
    </ul>
  );
};

SubNavigation.displayName = displayName;

export default SubNavigation;
