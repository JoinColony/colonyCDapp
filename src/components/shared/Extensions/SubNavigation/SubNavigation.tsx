import React, { PropsWithChildren, useMemo, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { SubNavigationItemProps } from './SubNavigationItem/types';
import SubNavigationItem from './SubNavigationItem/SubNavigationItem';
import PayDropdown from './DropdownItems/PayDropdown';
import DecideDropdown from './DropdownItems/DecideDropdown';
import ManageDropdown from './DropdownItems/ManageDropdown';
// import useDetectClickOutside from './useDetectClickOutside';

const displayName = 'Extensions.SubNavigation';

const MSG = defineMessages({
  pay: {
    id: `${displayName}.pay`,
    defaultMessage: 'Pay',
  },
  decide: {
    id: `${displayName}.decide`,
    defaultMessage: 'Decide',
  },
  manage: {
    id: `${displayName}.manage`,
    defaultMessage: 'Manage',
  },
});

const SubNavigation: React.FC<PropsWithChildren> = () => {
  const [openIndex, setOpenIndex] = useState<number>();
  // const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip(
  //   {
  //     delayShow: 200,
  //     placement: 'bottom',
  //     trigger: 'click',
  //     visible: isOpen,
  //   }
  //   // popperOptions
  // );

  const items = useMemo<SubNavigationItemProps[]>(() => {
    const navigationItems: SubNavigationItemProps[] = [
      {
        id: 0,
        label: <FormattedMessage {...MSG.pay} />,
        content: <PayDropdown />,
        isOpen: openIndex === 0,
        setOpen: () => setOpenIndex((prevState) => (prevState === 0 ? undefined : 0)),
      },
      {
        id: 1,
        label: <FormattedMessage {...MSG.decide} />,
        content: <DecideDropdown />,
        isOpen: openIndex === 1,
        setOpen: () => setOpenIndex((prevState) => (prevState === 1 ? undefined : 1)),
      },
      {
        id: 2,
        label: <FormattedMessage {...MSG.manage} />,
        content: <ManageDropdown />,
        isOpen: openIndex === 2,
        setOpen: () => setOpenIndex((prevState) => (prevState === 2 ? undefined : 2)),
      },
    ];

    return navigationItems;
  }, [openIndex]);

  // const ref = useDetectClickOutside({ onTriggered: () => setOpenIndex(undefined) });

  return (
    <ul className="flex gap-8 font-semibold text-md text-gray-700">
      {items.map((item) => (
        <SubNavigationItem {...item} key={item.id} />
      ))}
    </ul>
  );
};

SubNavigation.displayName = displayName;

export default SubNavigation;
