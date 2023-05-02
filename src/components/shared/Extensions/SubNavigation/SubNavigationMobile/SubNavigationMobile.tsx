import React, { PropsWithChildren, useMemo, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { useDetectClickOutside } from '~hooks';

import { SubNavigationItemProps } from '../SubNavigationItem/types';
import PayDropdown from '../DropdownItems/PayDropdown';
import DecideDropdown from '../DropdownItems/DecideDropdown';
import ManageDropdown from '../DropdownItems/ManageDropdown';
import SubNavigationItemMobile from '../SubNavigationItemMobile/SubNavigationItemMobile';

import styles from './SubNavigationMobile.module.css';

const displayName = 'Extensions.SubNavigation.SubNavigationMobile';

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

const SubNavigationMobile: React.FC<PropsWithChildren> = () => {
  const [openIndex, setOpenIndex] = useState<number>();

  const items = useMemo<SubNavigationItemProps[]>(
    (): SubNavigationItemProps[] => [
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
    ],
    [openIndex],
  );

  const ref = useDetectClickOutside({ onTriggered: () => setOpenIndex(undefined) });

  return (
    <ul className={styles.listWrapper} ref={ref}>
      {items.map((item) => (
        <SubNavigationItemMobile {...item} key={item.id} />
      ))}
    </ul>
  );
};

SubNavigationMobile.displayName = displayName;

export default SubNavigationMobile;
