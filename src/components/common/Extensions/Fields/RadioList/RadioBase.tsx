import clsx from 'clsx';
import React, { FC } from 'react';

import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import Icon from '~shared/Icon/index.ts';
import { formatText } from '~utils/intl.ts';
import ExtensionStatusBadge from '~v5/common/Pills/ExtensionStatusBadge/index.ts';

import { RadioBaseProps, RadioItemProps } from './types.ts';

import styles from './RadioList.module.css';

const displayName = 'common.Extensions.Fields.RadioBase';

const RadioBase: FC<RadioBaseProps> = ({
  item,
  isError,
  onChange,
  name,
  checked,
}) => {
  const { disabled, label, description, value, badge, tooltip } =
    item as RadioItemProps;

  const labelText = formatText(label);

  return (
    <div className={styles.wrapper}>
      <input
        type="radio"
        name={name}
        value={value}
        id={label}
        aria-disabled={disabled}
        disabled={disabled}
        checked={checked}
        className={clsx('peer/radio hidden', {
          'pointer-events-none opacity-50': disabled,
        })}
        onChange={(e) => onChange?.(e.target.value)}
      />
      <label
        htmlFor={label}
        className={clsx(
          styles.radioButtonLabel,
          `border-gray-300 peer-checked/radio:border-blue-400 peer-checked/radio:before:border-blue-400 peer-checked/radio:after:opacity-100 peer-focus/radio:border-blue-200 peer-focus/radio:before:bg-gray-25 before:top-[0.875rem] after:top-[0.875rem]`,
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
            {description && (
              <span className={styles.description}>
                {formatText(description)}
              </span>
            )}
          </div>
          {badge && (
            <div className="flex shrink-0">
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
