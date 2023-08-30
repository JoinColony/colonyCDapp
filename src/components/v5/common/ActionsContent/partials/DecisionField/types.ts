import { MessageDescriptor } from 'react-intl';

export interface DecisionMethodProps {
  key: string;
  label: MessageDescriptor;
  value: string;
}

export type DecisionFieldProps = {
  isError?: boolean;
};
