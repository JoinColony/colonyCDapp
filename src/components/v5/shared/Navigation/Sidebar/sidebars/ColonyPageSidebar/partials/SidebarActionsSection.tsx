import { FilePlus, MagicWand, Money } from '@phosphor-icons/react';
import React from 'react';

import { Action } from '~constants/actions.ts';

import SidebarActionItem from '../../../partials/SidebarActionItem/index.ts';

export const SidebarActionsSection = () => (
  <section className="flex w-full flex-col gap-0.5">
    <SidebarActionItem
      translation={{ id: 'action.makePayment' }}
      Icon={Money}
      action={Action.PaymentGroup}
    />
    <SidebarActionItem
      translation={{ id: 'action.manageColony' }}
      Icon={MagicWand}
      action={Action.ManageColonyObjectives}
    />
    <SidebarActionItem
      translation={{ id: 'button.createDecision' }}
      Icon={FilePlus}
      action={Action.CreateDecision}
    />
  </section>
);
