import React, {
  ReactNode,
  SyntheticEvent,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { MessageDescriptor } from 'react-intl';
import { nanoid } from 'nanoid';

import { PopperOptions } from 'react-popper-tooltip';

import InputLabel from '~shared/Fields/InputLabel';
import { Tooltip } from '~shared/Popover';
import asFieldArray, {
  AsFieldArrayEnhancedProps,
} from '~shared/Fields/asFieldArray';
import { SimpleMessageValues } from '~types';
import { getMainClasses } from '~utils/css';

import styles from './Checkbox.css';

interface Appearance {
  theme: 'dark';
  direction: 'vertical' | 'horizontal';
}

interface Props {
  /** Appearance object */
  appearance?: Appearance;
  /** Children to render in place of the default label */
  children?: ReactNode;
  /** Additional className for customizing styles */
  className?: string;
  /** Disable the input */
  disabled: boolean;
  /** Display the element without label */
  elementOnly?: boolean;
  /** Help text (will appear next to label text) */
  help?: string | MessageDescriptor;
  /** Values for help text (react-intl interpolation) */
  helpValues?: SimpleMessageValues;
  /** Label text */
  label: string | MessageDescriptor;
  /** Values for label text (react-intl interpolation) */
  labelValues?: SimpleMessageValues;
  /** Input field name (form variable) */
  name: string;
  /** Standard input field property */
  onChange?: (event: { [s: string]: any }) => void;
  /** Input field value */
  value: string;
  /**  Text for the checkbox tooltip */
  tooltipText?: string;
  /** Options to pass to the underlying PopperJS element. See here for more: https://popper.js.org/docs/v2/constructors/#options. */
  tooltipPopperOptions?: PopperOptions;
  dataTest?: string;
}

const displayName = 'Checkbox';

const Checkbox = ({
  appearance,
  children,
  className,
  disabled,
  elementOnly,
  form: { values },
  help,
  helpValues,
  label,
  labelValues,
  name,
  onChange,
  push,
  remove,
  value,
  tooltipText,
  tooltipPopperOptions,
  dataTest,
}: AsFieldArrayEnhancedProps<Props>) => {
  const [inputId] = useState<string>(nanoid());

  const handleOnChange = useCallback(
    (e: SyntheticEvent<HTMLInputElement>) => {
      const idx = values[name].indexOf(value);
      if (idx >= 0) {
        remove(idx);
      } else {
        push(value);
      }
      if (onChange) {
        onChange(e);
      }
    },
    [name, onChange, push, remove, value, values],
  );

  const isChecked = values[name].indexOf(value) >= 0;
  const mainClasses = getMainClasses(appearance, styles, {
    isChecked,
    disabled,
  });
  const classNames = className ? `${mainClasses} ${className}` : mainClasses;

  const checkboxInputContent = (
    <>
      <input
        id={inputId}
        className={styles.delegate}
        name={name}
        type="checkbox"
        disabled={disabled}
        onChange={handleOnChange}
        aria-disabled={disabled}
        aria-checked={isChecked}
        data-test={dataTest}
      />
      <span className={styles.checkbox}>
        <span className={styles.checkmark} />
      </span>
    </>
  );

  return (
    <label className={classNames} htmlFor={elementOnly ? inputId : undefined}>
      {disabled && tooltipText ? (
        <Tooltip
          content={tooltipText}
          placement="bottom"
          popperOptions={tooltipPopperOptions}
        >
          <div>{checkboxInputContent}</div>
        </Tooltip>
      ) : (
        checkboxInputContent
      )}
      {!elementOnly && !!label ? (
        <InputLabel
          inputId={inputId}
          label={label}
          labelValues={labelValues}
          help={help}
          helpValues={helpValues}
          appearance={{ direction: 'horizontal' }}
        />
      ) : (
        label || children
      )}
    </label>
  );
};

Checkbox.displayName = displayName;

Checkbox.defaultProps = {
  appearance: {
    direction: 'vertical',
  },
  checked: false,
  disabled: false,
  elementOnly: false,
};

export default asFieldArray<Props>(Checkbox);
