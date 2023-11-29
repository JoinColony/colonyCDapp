export interface FormErrorProps {
  alignment?: TextAlignment;
  isFullSize?: boolean;
  allowLayoutShift?: boolean;
}

type TextAlignment = 'right' | 'left' | 'center';
