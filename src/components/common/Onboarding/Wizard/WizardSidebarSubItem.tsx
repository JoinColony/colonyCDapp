import clsx from 'clsx';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { type Optional } from 'utility-types';

import { usePageThemeContext } from '~context/PageThemeContext/PageThemeContext.ts';

import { type WizardStep } from './types.ts';

const displayName =
  'routes.WizardRoute.WizardSidebar.WizardSidebarItem.WizardSidebarSubItem';

export type WizardSidebarSubStep = Optional<WizardStep, 'subItems' | 'text'>;

interface Props extends Pick<WizardSidebarSubStep, 'text'> {
  isActive: boolean;
}

const WizardSidebarSubItem = ({ text: stepText, isActive }: Props) => {
  const { isDarkMode } = usePageThemeContext();

  return (
    <span
      className={clsx('ml-[26px] text-xs text-base-white', {
        'font-semibold underline': isActive,
        '!text-gray-900': isDarkMode,
      })}
    >
      <FormattedMessage {...stepText} />
    </span>
  );
};

WizardSidebarSubItem.displayName = displayName;

export default WizardSidebarSubItem;
