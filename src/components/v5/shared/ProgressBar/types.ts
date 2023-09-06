import { MessageDescriptor } from 'react-intl';

export interface ProgressBarProps {
  progress?: number;
  isTall?: boolean;
  additionalText?: string | MessageDescriptor;
}
