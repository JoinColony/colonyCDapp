import clsx from 'clsx';
import { Info } from 'phosphor-react';
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
    <div className={clsx(className, 'py-6 flex items-start justify-between')}>
      <div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center">
            <h5 className={clsx(titleClassName, 'text-1 mr-1.5')}>
              {formatText(title)}
            </h5>
            {tooltipMessage && (
              <Tooltip
                tooltipContent={<span>{formatText(tooltipMessage)}</span>}
              >
                <span className="text-gray-400 flex">
                  <Info size={18} />
                </span>
              </Tooltip>
            )}
          </div>
          <p className="text-sm text-gray-600 max-w-[35rem]">
            {formatText(description)}
          </p>
        </div>
        {additionalContent && (
          <div className="flex w-full items-center justify-between mt-6">
            <p className="text-md font-medium">{additionalContent}</p>
          </div>
        )}
      </div>
      <FormSwitch name={name} />
      {onClick && buttonLabel && (
        <Button
          mode={buttonMode}
          onClick={onClick}
          iconName={buttonIcon}
          text={buttonLabel}
        />
      )}
    </div>
  );
};

SettingsRow.displayName = displayName;

export default SettingsRow;
