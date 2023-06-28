export interface SelectProps<T> {
  selectedElement: number;
  handleChange: (id: number) => void;
  list: T;
}
