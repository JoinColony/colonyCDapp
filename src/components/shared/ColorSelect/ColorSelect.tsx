import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';
import { useFormContext } from 'react-hook-form';

import { Appearance, HookFormSelect as Select } from '~shared/Fields';
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

  /** Callback function, called after value is changed */
  onColorChange?: (color: DomainColor) => any;

  appearance?: Appearance;

  /*
   * Name of the form element
   */
  name?: string;
}

const displayName = 'ColorSelect';

const ColorSelect = ({ disabled, onColorChange, appearance, name = 'color' }: Props) => {
  const { watch } = useFormContext();
  const activeOption = watch(name);

  const onChange = useCallback(
    (color: DomainColor) => {
      if (onColorChange) {
        return onColorChange(color);
      }
      return null;
    },
    [onColorChange],
  );

  const renderActiveOption = () => <ColorTag color={activeOption} />;

  const options = Object.values(DomainColor).map((color) => ({
    children: <ColorTag color={color} />,
    label: color,
    value: color,
  }));

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
