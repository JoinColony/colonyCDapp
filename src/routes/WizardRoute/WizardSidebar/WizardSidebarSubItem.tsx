import React from 'react';
import { FormattedMessage } from 'react-intl';
import clsx from 'clsx';
import { Optional } from 'utility-types';

import { useWizardContext } from '../WizardLayout';
import { WizardStep } from './WizardSidebar';

const displayName =
  'routes.WizardRoute.WizardSidebar.WizardSidebarItem.WizardSidebarSubItem';

export type WizardSubStep = Optional<WizardStep, 'subItems' | 'itemText'>;

interface Props extends Optional<WizardSubStep, 'itemText'> {
  hasActiveMiniItem: boolean;
}

const WizardSidebarSubItem = ({
  itemStep,
  itemText,
  hasActiveMiniItem,
}: Props) => {
  const { currentStep } = useWizardContext();

  if (!itemText) {
    return null;
  }

  return (
    <span
      className={clsx('text-xs ml-[26px]', {
        'text-blue-400 font-semibold':
          currentStep === itemStep || hasActiveMiniItem,
      })}
    >
      <FormattedMessage {...itemText} />
    </span>
  );
};

WizardSidebarSubItem.displayName = displayName;

export default WizardSidebarSubItem;
