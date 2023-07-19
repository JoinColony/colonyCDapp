import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { SettingsRowProps } from './types';
import Switch from '~v5/common/Fields/Switch';
import Button from '~v5/shared/Button';
import Icon from '~shared/Icon';
import Tooltip from '~shared/Extensions/Tooltip';

const displayName = 'v5.pages.UserAdvancedPage.partials.SettingsRow';

const SettingsRow: FC<SettingsRowProps> = ({
  description,
  title,
  tooltipMessage,
  buttonIcon,
  buttonLabel,
  buttonMode,
  onChange,
  onClick,
  id,
}) => {
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
      {onChange && (
        <Switch
          id={id}
          onChange={({ target }) => {
            onChange(target.checked);
          }}
        />
      )}
      {onClick && buttonLabel && (
        <Button mode={buttonMode} onClick={onClick} iconName={buttonIcon}>
          {formatMessage(buttonLabel)}
        </Button>
      )}
    </div>
  );
};

SettingsRow.displayName = displayName;

export default SettingsRow;
