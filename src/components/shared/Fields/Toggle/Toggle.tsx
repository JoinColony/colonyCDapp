import React, { useCallback } from 'react';
import { PopperOptions } from 'react-popper-tooltip';
import { MessageDescriptor } from 'react-intl';
import { useFormContext } from 'react-hook-form';

import InputLabel from '~shared/Fields/InputLabel';
import QuestionMarkTooltip from '~shared/QuestionMarkTooltip';

import { ComplexMessageValues, SimpleMessageValues } from '~types';
import { getMainClasses } from '~utils/css';

import styles from './Toggle.css';

const displayName = 'Toggle';

interface Appearance {
  theme?: 'primary' | 'danger';
}
interface Props {
  appearance?: Appearance;
  name: string;
  label?: string | MessageDescriptor;
  labelValues?: SimpleMessageValues;
  disabled?: boolean;
  tooltipText?: string | MessageDescriptor;
  tooltipTextValues?: ComplexMessageValues;
  tooltipClassName?: string;
  elementOnly?: boolean;
  /** Options to pass to the underlying PopperJS element. See here for more: https://popper.js.org/docs/v2/constructors/#options. */
  tooltipPopperOptions?: PopperOptions;
  onChange?: (value: boolean) => any;
}

const Toggle = ({
  appearance,
  name,
  label,
  labelValues,
  disabled = false,
  elementOnly = false,
  tooltipTextValues,
  tooltipText,
  tooltipClassName,
  tooltipPopperOptions = {
    placement: 'right-start',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [-3, 10],
        },
      },
    ],
  },
  onChange: onChangeCallback,
}: Props) => {
  const { register, getValues } = useFormContext();
  const { onChange } = register(name);
  const value = getValues(name);
  const mainClasses = getMainClasses(appearance, styles);

  const handleOnChange = useCallback(
    (event) => {
      onChange(event);
      if (onChangeCallback) {
        onChangeCallback(value);
      }
    },
    [onChange, onChangeCallback, value],
  );

  return (
    <div className={styles.container}>
      {!elementOnly && label && (
        <InputLabel
          label={label}
          labelValues={labelValues}
          appearance={{ colorSchema: 'grey' }}
        />
      )}
      <div>
        <input
          name={name}
          type="checkbox"
          disabled={disabled}
          checked={value}
          aria-checked={value}
          aria-disabled={disabled}
          className={styles.delegate}
          onChange={handleOnChange}
        />
        <span className={disabled ? styles.toggleDisabled : styles.toggle}>
          <span className={value ? mainClasses : styles.toggleSwitch} />
        </span>
      </div>
      {tooltipText && (
        <QuestionMarkTooltip
          className={styles.icon}
          tooltipText={tooltipText}
          tooltipPopperOptions={tooltipPopperOptions}
          tooltipTextValues={tooltipTextValues}
          tooltipClassName={tooltipClassName}
        />
      )}
    </div>
  );
};

Toggle.displayName = displayName;

export default Toggle;
