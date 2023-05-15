import React, { PropsWithChildren, useState, FC } from 'react';

import { useDetectClickOutside } from '~hooks';

import SubNavigationItem from './SubNavigationItem';
import { displayName, subNavigationItems } from './consts';

const SubNavigation: FC<PropsWithChildren> = () => {
  const [openIndex, setOpenIndex] = useState<number>();

  const ref = useDetectClickOutside({ onTriggered: () => setOpenIndex(undefined) });

  return (
    <ul className="flex gap-8 text-md text-gray-700" ref={ref}>
      {subNavigationItems.map(({ id, label, content, icon }) => (
        <SubNavigationItem
          key={id}
          id={id}
          label={label}
          content={content}
          icon={icon}
          isOpen={openIndex === id}
          setOpen={() => setOpenIndex((prevState) => (prevState === id ? undefined : id))}
        />
      ))}
    </ul>
  );
};

SubNavigation.displayName = displayName;

export default SubNavigation;
