import React from 'react';
import { useFormContext } from 'react-hook-form';

import InputLabel from '~shared/Fields/InputLabel';
import QuestionMarkTooltip from '~shared/QuestionMarkTooltip';

import { getMainClasses } from '~utils/css';

import styles from '../Toggle.css';
import { HookFormCheckboxProps } from '~shared/Fields/Checkbox';

const displayName = 'HookFormToggle';

interface Appearance {
  theme?: 'primary' | 'danger';
}

interface Props extends Omit<HookFormCheckboxProps, 'appearance'> {
  appearance?: Appearance;
}

const HookFormToggle = ({
  appearance,
  name,
  label,
  labelValues,
  disabled = false,
  elementOnly = false,
  onChange,
  tooltipTextValues,
  tooltipText,
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
  ...toggleProps
}: Props) => {
  const { register, watch } = useFormContext();
  const { onChange: hookFormOnChange, ...hookFormHelpers } = register(name);

  const value = watch(name);

  const mainClasses = getMainClasses(appearance, styles);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    hookFormOnChange(e);
    onChange?.(e);
  };
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
          {...hookFormHelpers}
          type="checkbox"
          disabled={disabled}
          aria-checked={value}
          aria-disabled={disabled}
          className={styles.delegate}
          onChange={handleChange}
          {...toggleProps}
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
        />
      )}
    </div>
  );
};

HookFormToggle.displayName = displayName;

export default HookFormToggle;
