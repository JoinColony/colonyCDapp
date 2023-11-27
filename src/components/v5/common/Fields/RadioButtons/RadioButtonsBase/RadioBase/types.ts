export interface RadioProps
  extends Omit<React.HTMLProps<HTMLInputElement>, 'children' | 'id'> {
  id: string;
  wrapperClassName?: string;
  labelClassName?: string;
  children?:
    | React.ReactNode
    | ((opts: Pick<RadioProps, 'checked' | 'disabled'>) => React.ReactNode);
}
