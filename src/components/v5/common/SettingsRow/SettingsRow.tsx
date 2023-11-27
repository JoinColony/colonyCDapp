import React from 'react';
import { useIntl } from 'react-intl';

import { FieldPath, FieldValues } from 'react-hook-form';
import { SettingsRowProps } from './types';
import { FormSwitch } from '~v5/common/Fields/Switch';
import Button from '~v5/shared/Button';
import Icon from '~shared/Icon';
import Tooltip from '~shared/Extensions/Tooltip';

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
  onChange,
  onClick,
  id,
}: SettingsRowProps<TFieldValues, TFieldName>) => {
  const { formatMessage } = useIntl();

  return (
    <div className="py-6 flex items-start justify-between">
      <div>
        <div className="flex items-center mb-1">
          <h5 className="text-1 mr-1.5">{formatMessage(title)}</h5>
          {tooltipMessage && (
            <Tooltip
              tooltipContent={<span>{formatMessage(tooltipMessage)}</span>}
            >
              <span className="text-gray-400 flex">
                <Icon name="info" appearance={{ size: 'small' }} />
              </span>
            </Tooltip>
          )}
        </div>
        <p className="text-sm text-gray-600 max-w-[35rem]">
          {formatMessage(description)}
        </p>
      </div>
      {onChange && <FormSwitch name={id || ''} />}
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
