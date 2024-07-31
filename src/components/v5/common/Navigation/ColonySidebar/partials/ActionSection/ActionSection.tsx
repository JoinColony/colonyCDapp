import { FilePlus, MagicWand, Money } from '@phosphor-icons/react';
import React from 'react';

import { Action } from '~constants/actions.ts';

import ActionItem from './partials/ActionSectionItem/index.ts';

const displayName = 'v5.common.Navigation.ColonySidebar.partials.ActionSection';

const ActionSection = () => (
  <section className="flex w-full flex-col gap-0.5">
    <ActionItem
      translation={{ id: 'actions.simplePayment' }}
      Icon={Money}
      action={Action.SimplePayment}
    />
    <ActionItem
      translation={{ id: 'action.manageColony' }}
      Icon={MagicWand}
      action={Action.ManageColonyObjectives}
    />
    <ActionItem
      translation={{ id: 'button.createDecision' }}
      Icon={FilePlus}
      action={Action.CreateDecision}
    />
  </section>
);

ActionSection.displayName = displayName;

export default ActionSection;
