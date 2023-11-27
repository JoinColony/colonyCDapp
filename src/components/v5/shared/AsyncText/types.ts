import { MessageDescriptor } from 'react-intl';

export interface AsyncTextProps {
  text: React.ReactNode | (() => Promise<React.ReactNode>);
  loadingMessage?: string | MessageDescriptor;
  errorMessage?: string | MessageDescriptor;
}
