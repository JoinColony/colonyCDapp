import React, { ReactNode, useCallback } from 'react';
// import { ColonyVersion, ROOT_DOMAIN_ID, Extension } from '@colony/colony-js';

import ColorTag from '~shared/ColorTag';
import { HookForm as Form, SelectOption } from '~shared/Fields';
import DomainDropdown from '~shared/DomainDropdown';
// import { useDialog } from '~shared/Dialog';
// import EditDomainDialog from '~dialogs/EditDomainDialog';

import { useColonyContext } from '~hooks';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
// import { oneTxMustBeUpgraded } from '~modules/dashboard/checks';
import { Color, graphQlDomainColorMap } from '~types';

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

const ColonyDomainSelector = ({
  filteredDomainId = COLONY_TOTAL_BALANCE_DOMAIN_ID,
  onDomainChange,
}: Props) => {
  const { colony, canInteractWithColony } = useColonyContext();
  const { domains } = colony || {};

  // const { data } = useColonyExtensionsQuery({
  //   variables: { address: colonyAddress },
  // });

  // const openEditDialog = useDialog(EditDomainDialog);
  // const handleEditDomain = useCallback(
  //   (ethDomainId: number) =>
  //     openEditDialog({
  //       ethDomainId,
  //       colony,
  //     }),
  //   [openEditDialog, colony],
  // );

  const ROOT_DOMAIN_ID = 1;

  const handleEditDomain = () => {};

  const getDomainColor = useCallback<(domainId: string | undefined) => Color>(
    (domainId) => {
      const rootDomainColor: Color = Color.LightPink;
      const defaultColor: Color = Color.Yellow;
      if (domainId === String(ROOT_DOMAIN_ID)) {
        return rootDomainColor;
      }
      if (!colony || !domainId) {
        return defaultColor;
      }
      const domain = domains?.items?.find(
        (currentDomain) => Number(domainId) === currentDomain?.nativeId,
      );
      return domain
        ? graphQlDomainColorMap[domain?.color || defaultColor]
        : defaultColor;
    },
    [colony, domains],
  );

  const renderActiveOption = useCallback<
    (option: SelectOption | undefined, label: string) => ReactNode
  >(
    (option, label) => {
      const value = option ? option.value : undefined;
      const color = getDomainColor(value);
      return (
        <div className={styles.activeItem}>
          <ColorTag color={color} />{' '}
          <div className={styles.activeItemLabel}>{label}</div>
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
        footerComponent={
          canInteractWithColony ? <CreateDomainButton /> : undefined
        }
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
