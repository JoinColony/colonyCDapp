export type FilterButtonProps = {
  isOpen: boolean;
  numberSelectedFilters?: number;
  setTriggerRef?: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  onClick?: () => void;
  customLabel?: React.ReactNode;
  className?: string;
};
