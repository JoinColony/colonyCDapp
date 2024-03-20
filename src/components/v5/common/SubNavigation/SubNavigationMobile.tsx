import React, { type PropsWithChildren, useState, type FC } from 'react';

import useDetectClickOutside from '~hooks/useDetectClickOutside.ts';

import { SubNavigationItems } from './partials/SubNavigationItem/index.ts';
import SubNavigationItemMobile from './partials/SubNavigationItem/SubNavigationItemMobile.tsx';

const displayName = 'v5.common.SubNavigation.SubNavigationMobile';

const SubNavigationMobile: FC<PropsWithChildren> = () => {
  const [openIndex, setOpenIndex] = useState<number>();

  const ref = useDetectClickOutside({
    onTriggered: () => setOpenIndex(undefined),
  });

  return (
    <ul className="flex flex-col text-md text-gray-700" ref={ref}>
      {SubNavigationItems.map(({ id, label, content, icon }) => (
        <SubNavigationItemMobile
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

SubNavigationMobile.displayName = displayName;

export default SubNavigationMobile;
