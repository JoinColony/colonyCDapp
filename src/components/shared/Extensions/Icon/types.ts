import { MessageDescriptor } from 'react-intl';
import { SimpleMessageValues } from '~types';

type Appearance = {
  theme?: 'primary' | 'invert';
  size?: 'extraTiny' | 'tiny' | 'small' | 'normal' | 'medium' | 'large' | 'huge';
};

export interface IconProps {
  appearance?: Appearance;
  children?: never;
  className?: string;
  name: string;
  title?: string | MessageDescriptor;
  titleValues?: SimpleMessageValues;
  viewBox?: string;
}
