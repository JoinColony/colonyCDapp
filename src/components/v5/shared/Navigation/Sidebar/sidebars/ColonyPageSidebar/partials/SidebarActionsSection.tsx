import { FilePlus, MagicWand, Money } from '@phosphor-icons/react';
import React from 'react';

import { TourTargets } from '~common/Tours/enums.ts';
import { Action } from '~constants/actions.ts';
import SidebarActionItem from '~v5/shared/Navigation/Sidebar/partials/SidebarActionItem/index.ts';

export const SidebarActionsSection = () => (
  <section
    className="flex w-full flex-col gap-0 md:gap-0.5"
    data-tour={TourTargets.ActionsMenu}
  >
    <SidebarActionItem
      translation={{ id: 'action.makePayment' }}
      Icon={Money}
      action={Action.PaymentGroup}
    />
    <SidebarActionItem
      translation={{ id: 'action.manageColony' }}
      Icon={MagicWand}
      action={Action.ManageColony}
    />
    <SidebarActionItem
      translation={{ id: 'button.createDecision' }}
      Icon={FilePlus}
      action={Action.CreateDecision}
    />
  </section>
);
