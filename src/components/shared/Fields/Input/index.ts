export { default } from './Input';
export {
  default as InputComponent,
  Props as InputComponentProps,
} from './InputComponent';

export interface InputComponentAppearance {
  theme?: 'fat' | 'underlined' | 'minimal' | 'dotted';
  align?: 'right';
  helpAlign?: 'right';
  direction?: 'horizontal';
  colorSchema?: 'dark' | 'grey' | 'transparent' | 'info';
  size?: 'small' | 'medium';
  statusSchema?: 'info';
  textSpace?: 'wrap';
}
