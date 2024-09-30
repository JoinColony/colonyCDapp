import { Eye } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';
import { Link } from 'react-router-dom';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { COLONY_MEMBERS_ROUTE } from '~routes/routeConstants.ts';
import { formatText } from '~utils/intl.ts';

import useDropdown from '../hooks/useDropdown.ts';

import { DropdownItem } from './DropdownItem.tsx';
import DropdownMenu from './DropdownMenu.tsx';

const displayName =
  'v5.frame.ColonyHome.ReputationChart.partials.ContributorActionsMenu';

const MSG = defineMessages({
  viewAllMembers: {
    id: `${displayName}.viewAllMembers`,
    defaultMessage: 'View members',
  },
});

interface ContributorActionsMenuProps {
  isDisabled?: boolean;
}

const ContributorActionsMenu: FC<ContributorActionsMenuProps> = ({
  isDisabled,
}) => {
  const {
    colony: { name: colonyName },
  } = useColonyContext();

  const { setTriggerRef, setTooltipRef, getTooltipProps, visible } =
    useDropdown();

  return (
    <DropdownMenu
      isDisabled={isDisabled}
      visible={visible}
      setTriggerRef={setTriggerRef}
      setTooltipRef={setTooltipRef}
      getTooltipProps={getTooltipProps}
    >
      <Link to={`/${colonyName}/${COLONY_MEMBERS_ROUTE}`} className="w-full">
        <DropdownItem icon={Eye} label={formatText(MSG.viewAllMembers)} />
      </Link>
    </DropdownMenu>
  );
};

ContributorActionsMenu.displayName = displayName;
export default ContributorActionsMenu;
