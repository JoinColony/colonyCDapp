import { UseFormRegister } from 'react-hook-form';
import { MessageDescriptor } from 'react-intl';
import { UserSettingsSlot } from '~context/userSettings';

import { ButtonMode } from '~v5/shared/Button/types';

export interface SettingsRowProps {
  title: MessageDescriptor;
  description: MessageDescriptor;
  tooltipMessage?: MessageDescriptor;
  onChange?: (value: boolean) => void;
  onClick?: () => void;
  buttonLabel?: MessageDescriptor;
  buttonIcon?: string;
  buttonMode?: ButtonMode;
  id?: string;
  register?: UseFormRegister<Partial<UserSettingsSlot>>;
}
