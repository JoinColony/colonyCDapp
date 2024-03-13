import { Info } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';
import { type FieldPath, type FieldValues } from 'react-hook-form';

import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { formatText } from '~utils/intl.ts';
import { FormSwitch } from '~v5/common/Fields/Switch/index.ts';
import Button from '~v5/shared/Button/index.ts';

import { type SettingsRowProps } from './types.ts';

const displayName = 'v5.common.SettingsRow';

const SettingsRow = <
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
>({
  description,
  title,
  tooltipMessage,
  buttonIcon,
  buttonLabel,
  buttonMode,
  onClick,
  name,
  className,
  titleClassName,
  additionalContent,
}: SettingsRowProps<TFieldValues, TFieldName>) => {
  return (
    <div className={clsx(className, 'flex items-start justify-between py-6')}>
      <div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center">
            <h5 className={clsx(titleClassName, 'mr-1.5 text-1')}>
              {formatText(title)}
            </h5>
            {tooltipMessage && (
              <Tooltip
                tooltipContent={<span>{formatText(tooltipMessage)}</span>}
              >
                <span className="flex text-gray-400">
                  <Info size={18} />
                </span>
              </Tooltip>
            )}
          </div>
          <p className="max-w-[35rem] text-sm text-gray-600">
            {formatText(description)}
          </p>
        </div>
        {additionalContent && (
          <div className="mt-6 flex w-full items-center justify-between">
            <p className="text-md font-medium">{additionalContent}</p>
          </div>
        )}
      </div>
      <FormSwitch name={name} />
      {onClick && buttonLabel && (
        <Button
          mode={buttonMode}
          onClick={onClick}
          icon={buttonIcon}
          text={buttonLabel}
        />
      )}
    </div>
  );
};

SettingsRow.displayName = displayName;

export default SettingsRow;
