import { MessageDescriptor } from 'react-intl';

export interface SpinnerProps {
  loading: boolean;
  loadingText?: MessageDescriptor | string;
}
