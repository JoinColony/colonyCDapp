import React, { ReactNode, useCallback } from 'react';
import { Id } from '@colony/colony-js';

import { useDialog } from '~shared/Dialog';
import ColorTag from '~shared/ColorTag';
import { HookForm as Form, SelectOption } from '~shared/Fields';
import DomainDropdown from '~shared/DomainDropdown';
import { EditDomainDialog } from '~common/Dialogs';

import { useColonyContext, useEnabledExtensions } from '~hooks';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
// import { oneTxMustBeUpgraded } from '~modules/dashboard/checks';
import { DomainColor } from '~types';

import CreateDomainButton from './CreateDomainButton';

import styles from './ColonyDomainSelector.css';

interface FormValues {
  filteredDomainId: string;
}

interface Props {
  filteredDomainId?: number;
  onDomainChange?: (domainId: number) => any;
}

const displayName = 'common.ColonyHome.ColonyDomainSelector';

const ColonyDomainSelector = ({ filteredDomainId = COLONY_TOTAL_BALANCE_DOMAIN_ID, onDomainChange }: Props) => {
  const { colony, canInteractWithColony } = useColonyContext();
  const { domains } = colony || {};
  const enabledExtensionData = useEnabledExtensions();

  const openEditDialog = useDialog(EditDomainDialog);
  const handleEditDomain = (selectedDomainId: number) =>
    colony &&
    openEditDialog({
      filteredDomainId: selectedDomainId,
      colony,
      enabledExtensionData,
    });

  const getDomainColor = useCallback<(domainId: number | undefined) => DomainColor>(
    (domainId) => {
      const rootDomainColor = DomainColor.LightPink;
      const defaultColor = DomainColor.Yellow;
      if (domainId === Id.RootDomain) {
        return rootDomainColor;
      }
      if (!colony || !domainId) {
        return defaultColor;
      }
      const domain = domains?.items?.find((currentDomain) => domainId === currentDomain?.nativeId);
      return domain?.metadata?.color || defaultColor;
    },
    [colony, domains],
  );

  const renderActiveOption = useCallback<(option: SelectOption | undefined, label: string) => ReactNode>(
    (option, label) => {
      const value = option ? option.value : undefined;
      const color = getDomainColor(Number(value));
      return (
        <div className={styles.activeItem}>
          <ColorTag color={color} /> <div className={styles.activeItemLabel}>{label}</div>
        </div>
      );
    },
    [getDomainColor],
  );

  if (!colony) {
    return null;
  }

  return (
    <Form<FormValues>
      defaultValues={{
        filteredDomainId: String(filteredDomainId),
      }}
      onSubmit={() => {}}
    >
      <DomainDropdown
        colony={colony}
        name="filteredDomainId"
        currentDomainId={filteredDomainId}
        onDomainChange={onDomainChange}
        onDomainEdit={canInteractWithColony ? handleEditDomain : undefined}
        footerComponent={canInteractWithColony ? <CreateDomainButton /> : undefined}
        renderActiveOptionFn={renderActiveOption}
        showAllDomains
        showDescription
        dataTest="colonyDomainSelector"
        itemDataTest="colonyDomainSelectorItem"
      />
    </Form>
  );
};

ColonyDomainSelector.displayName = displayName;

export default ColonyDomainSelector;
