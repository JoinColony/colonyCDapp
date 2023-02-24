import React, { ComponentProps, ReactNode, useCallback, useMemo } from 'react';
import { defineMessages } from 'react-intl';

import { Select, SelectOption } from '~shared/Fields';
import { Colony, DomainColor } from '~types';
import { notNull } from '~utils/arrays';

import DomainDropdownItem from './DomainDropdownItem';

const MSG = defineMessages({
  labelDomainFilter: {
    id: 'DomainDropdown.labelDomainFilter',
    defaultMessage: 'Filter by Domain',
  },
});

interface Props {
  /** Current colony from which to extract the valid domains */
  colony: Colony;

  /** Optional form element name */
  name?: string;

  /** Optional domain to emphasize the current selected domain */
  currentDomainId?: number;

  /** Optional callback triggereded when the domain is being changed via the dropdown */
  onDomainChange?: (domainId: number) => any;

  /** Optional method to trigger when clicking the "Edit Domain" button   */
  onDomainEdit?: (domainId: number) => any;

  /** Optional component to display in the footer of the dropdown */
  footerComponent?: ReactNode;

  /** The optional component (rendered via a function) to use as a trigger in order to open the dropdown */
  renderActiveOptionFn?: (
    activeOption: SelectOption | undefined,
    activeOptionLabel: string,
  ) => ReactNode;

  /** Optional method to filter the options array */
  filterOptionsFn?: (option: SelectOption) => boolean;

  /** Toggle if to display the "All Domains" entry */
  showAllDomains?: boolean;

  /** Toggle if to show the domains descriptions text (if available) */
  showDescription?: boolean;

  /** Toggle if to set the domain dropdown in a disabled state (won't open) */
  disabled?: boolean;

  /** Provides value for data-test prop in select button used on cypress testing */
  dataTest?: string;

  /** Provides value for data-test prop in select items used on cypress testing */
  itemDataTest?: string;
}

const displayName = 'DomainDropdown';

const DomainDropdown = ({
  colony,
  name = 'selectedDomainId',
  currentDomainId,
  onDomainChange,
  onDomainEdit,
  footerComponent,
  renderActiveOptionFn,
  filterOptionsFn,
  showAllDomains = true,
  showDescription = true,
  disabled = false,
  dataTest,
  itemDataTest,
}: Props) => {
  const handleSubmit = useCallback(
    (domainId: number) => {
      if (onDomainChange) {
        return onDomainChange(domainId);
      }
      return null;
    },
    [onDomainChange],
  );

  const options = useMemo<ComponentProps<typeof Select>['options']>(() => {
    const allDomainsOption: SelectOption = {
      children: (
        <DomainDropdownItem
          domain={{
            /**
             * This is a dummy domain data that we use to display the "All Teams" option
             * The isRoot property has to be set to true so that it doesn't show as a subdomain in the dropdown
             */
            id: '',
            isRoot: true,
            nativeId: 0,
            nativeFundingPotId: 0,
            metadata: {
              name: 'All Teams',
              description: '',
              color: DomainColor.Yellow,
            },
          }}
          isSelected={currentDomainId === 0}
          onDomainEdit={onDomainEdit}
          showDescription={showDescription}
        />
      ),
      label: { id: 'domain.all' },
      value: '0',
    };
    const showAllDomainsOption = showAllDomains ? [allDomainsOption] : [];
    if (!colony) {
      return showAllDomainsOption;
    }
    const sortByDomainId = (
      { nativeId: firstDomainId },
      { nativeId: secondDomainId },
    ) => firstDomainId - secondDomainId;
    const domainOptions = [
      ...showAllDomainsOption,
      ...(colony.domains?.items || [])
        .filter(notNull)
        .sort(sortByDomainId)
        .map((domain) => {
          const { nativeId, metadata } = domain;
          const { name: domainName } = metadata || {};
          return {
            children: (
              <DomainDropdownItem
                domain={domain}
                isSelected={currentDomainId === nativeId}
                onDomainEdit={onDomainEdit}
                showDescription={showDescription}
              />
            ),
            label: domainName || `Domain #${nativeId}`,
            value: `${nativeId}`,
          };
        }),
    ];
    if (filterOptionsFn) {
      return domainOptions.filter(filterOptionsFn);
    }
    return domainOptions;
  }, [
    colony,
    currentDomainId,
    onDomainEdit,
    showDescription,
    showAllDomains,
    filterOptionsFn,
  ]);

  return (
    <Select
      appearance={{
        borderedOptions: 'true',
        size: 'mediumLarge',
        theme: 'alt',
        width: 'content',
      }}
      elementOnly
      label={MSG.labelDomainFilter}
      name={name}
      onChange={(val) => {
        handleSubmit(Number(val));
      }}
      options={options}
      optionsFooter={footerComponent}
      renderActiveOption={renderActiveOptionFn}
      disabled={disabled}
      dataTest={dataTest}
      itemDataTest={itemDataTest}
    />
  );
};

DomainDropdown.displayName = displayName;

export default DomainDropdown;
