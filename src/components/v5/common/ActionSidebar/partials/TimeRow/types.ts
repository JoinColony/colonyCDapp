import { type ActionFormRowProps } from '~v5/common/ActionFormRow/types.ts';

export interface TimeRowProps extends Pick<ActionFormRowProps, 'tooltips'> {
  name: string;
  title?: React.ReactNode;
  type?: 'start' | 'end';
}
