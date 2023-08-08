export interface SelectProps {
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
}
