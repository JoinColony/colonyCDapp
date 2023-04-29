import { MessageDescriptor } from 'react-intl';

export interface RadioItemProps {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioBaseProps extends RadioItemProps {
  error?: MessageDescriptor | string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  checked: boolean;
}

export interface RadioListProps extends RadioBaseProps {
  title: string;
  items: RadioItemProps[];
}
