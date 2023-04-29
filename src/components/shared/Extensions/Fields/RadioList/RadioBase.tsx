import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { useIntl } from 'react-intl';
import styles from './RadioList.module.css';
import { RadioBaseProps } from './types';

const displayName = 'common.Extensions.RadioList';

// tooltip and badge

const RadioBase = forwardRef<HTMLInputElement, RadioBaseProps>(
  ({ checked, disabled, error, label, description, ...rest }, ref) => {
    const { formatMessage } = useIntl();
    const labelText = typeof label == 'string' ? label : label && formatMessage(label);
    const descriptionText = typeof description == 'string' ? description : description && formatMessage(description);

    return (
      <div className="relative w-full">
        <input
          id={label}
          type="radio"
          className={clsx('peer/radio hidden', {
            'pointer-events-none opacity-50': disabled,
          })}
          aria-disabled={disabled}
          disabled={disabled}
          checked={checked}
          {...{ ref, ...rest }}
        />
        <label
          htmlFor={label}
          className={clsx(
            styles.radioButtonLabel,
            `border-gray-300 peer-checked/radio:border-blue-400 peer-checked/radio:before:border-blue-400 peer-checked/radio:after:opacity-100 peer-focus/radio:border-blue-200  peer-focus/radio:before:bg-gray-25`,
            {
              'border-negative-400': !!error,
              'pointer-events-none border-gray-300 opacity-50': disabled,
            }
          )}
        >
          <span className={styles.label}>{labelText}</span>
          {descriptionText && <span className={styles.description}>{descriptionText}</span>}
        </label>
      </div>
    );
  }
);

RadioBase.displayName = displayName;

export default RadioBase;
