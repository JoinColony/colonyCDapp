import React, { useCallback, useMemo, ReactNode, ComponentProps } from 'react';
import { defineMessages } from 'react-intl';

import { Appearance, Select, SelectOption } from '~shared/Fields';
import ColorTag from '~shared/ColorTag';
import { DomainColor } from '~types';

import styles from './ColorSelect.css';

const MSG = defineMessages({
  labelColorSelect: {
    id: 'ColorSelect.labelColorSelect',
    defaultMessage: 'Select color',
  },
});

interface Props {
  /** Should `select` be disabled */
  disabled?: boolean;

  /** Active color */
  activeOption: DomainColor;

  /** Callback function, called after value is changed */
  onColorChange?: (color: DomainColor) => any;

  appearance?: Appearance;

  /*
   * Name of the form element
   */
  name?: string;
}

const displayName = 'ColorSelect';

const ColorSelect = ({
  disabled,
  activeOption,
  onColorChange,
  appearance,
  name = 'color',
}: Props) => {
  const onChange = useCallback(
    (color: DomainColor) => {
      if (onColorChange) {
        return onColorChange(color);
      }
      return null;
    },
    [onColorChange],
  );

  const renderActiveOption = useCallback<
    (option: SelectOption | undefined, label: string) => ReactNode
  >(() => {
    return <ColorTag color={activeOption} />;
  }, [activeOption]);

  const options = useMemo<ComponentProps<typeof Select>['options']>(() => {
    const colors = Object.keys(DomainColor).filter(
      (val) => typeof DomainColor[val as any] === 'number',
    );
    return [
      ...colors.map((color) => {
        return {
          children: <ColorTag color={DomainColor[color]} />,
          label: `${color}`,
          value: `${DomainColor[color]}`,
        };
      }),
    ];
  }, []);

  return (
    <div className={styles.main}>
      <Select
        appearance={{
          theme: 'grid',
          alignOptions: appearance?.alignOptions,
        }}
        elementOnly
        label={MSG.labelColorSelect}
        name={name}
        onChange={(val) => {
          onChange(DomainColor[Number(val)]);
        }}
        options={options}
        renderActiveOption={renderActiveOption}
        disabled={disabled}
      />
    </div>
  );
};

ColorSelect.displayName = displayName;

export default ColorSelect;
