import React, { FC } from 'react';
import clsx from 'clsx';
import { useIntl } from 'react-intl';
import styles from './RadioList.module.css';
import { RadioBaseProps } from './types';
import ExtensionStatusBadge from '~common/Extensions/ExtensionStatusBadge-new';
import Tooltip from '~shared/Extensions/Tooltip/Tooltip';
import Icon from '~shared/Icon';

const displayName = 'Extensions.Fields.RadioBase';

const RadioBase: FC<RadioBaseProps> = ({ item, isError, register }) => {
  // @ts-ignore
  const { disabled, label, description, value, badge, tooltip } = item;

  const { formatMessage } = useIntl();

  const labelText = typeof label == 'string' ? label : label && formatMessage(label);
  const descriptionText = typeof description == 'string' ? description : description && formatMessage(description);

  return (
    <div className="relative w-full">
      <input
        type="radio"
        {...register('radio')}
        id={label}
        aria-disabled={disabled}
        disabled={disabled}
        className={clsx('peer/radio hidden', {
          'pointer-events-none opacity-50': disabled,
        })}
        value={value}
      />
      <label
        htmlFor={label}
        className={clsx(
          styles.radioButtonLabel,
          `border-gray-300 peer-checked/radio:border-blue-400 peer-checked/radio:before:border-blue-400 peer-checked/radio:after:opacity-100 peer-focus/radio:border-blue-200 peer-focus/radio:before:bg-gray-25 before:top-[0.8125rem] after:top-[0.8125rem]`,
          {
            'before:top-4 after:top-4': !!badge,
            'border-negative-400': isError,
            'pointer-events-none border-gray-300 opacity-50': disabled,
          },
        )}
      >
        <div className={badge && 'flex justify-between gap-2'}>
          <div className="self-center">
            <div className={tooltip && 'inline-flex items-center '}>
              <span className={styles.label}>{labelText}</span>
              {tooltip && (
                <div className="flex items-center ml-2 text-gray-400">
                  <Tooltip {...tooltip}>
                    <Icon
                      name="info"
                      appearance={{
                        size: 'extraTiny',
                      }}
                    />
                  </Tooltip>
                </div>
              )}
            </div>
            {descriptionText && <span className={styles.description}>{descriptionText}</span>}
          </div>
          {badge && (
            <div className="flex flex-shrink-0">
              <ExtensionStatusBadge {...badge} />
            </div>
          )}
        </div>
      </label>
    </div>
  );
};

RadioBase.displayName = displayName;

export default RadioBase;
