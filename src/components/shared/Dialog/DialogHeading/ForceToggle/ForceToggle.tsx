import React from 'react';
import { PopperOptions } from 'react-popper-tooltip';
import { MessageDescriptor } from 'react-intl';

import { HookFormToggle as Toggle } from '~shared/Fields';

import styles from './ForceToggle.css';

const displayName = 'DialogHeading.ForceToggle';

interface Props {
  name?: string;
  label?: string | MessageDescriptor;
  disabled?: boolean;
  tooltipText?: string | MessageDescriptor;
  tooltipClassName?: string;
  tooltipPopperOptions?: PopperOptions;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const ForceToggle = ({
  name = 'forceAction',
  label = { id: 'label.force' },
  disabled = false,
  tooltipText = { id: 'tooltip.forceToggle' },
  tooltipClassName = styles.tooltip,
  tooltipPopperOptions = {
    placement: 'top-end',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [10, 12],
        },
      },
    ],
  },
  onChange,
}: Props) => (
  <Toggle
    name={name}
    label={label}
    disabled={disabled}
    tooltipText={tooltipText}
    tooltipClassName={tooltipClassName}
    tooltipPopperOptions={tooltipPopperOptions}
    onChange={onChange}
  />
);

ForceToggle.displayName = displayName;

export default ForceToggle;
