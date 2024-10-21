export interface RadioButtonProps
  extends Omit<React.HTMLProps<HTMLInputElement>, 'children' | 'id'> {
  id: string;
  children?: React.ReactNode;
  hasError?: boolean;
}

export enum PenaliseOptions {
  Yes = 'yes',
  No = 'no',
}
