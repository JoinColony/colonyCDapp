import { MessageDescriptor } from 'react-intl';

export interface ObjectiveBoxProps {
  title?: MessageDescriptor;
  description?: MessageDescriptor;
  progress: number;
}
