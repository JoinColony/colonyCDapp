export type FilterButtonProps = {
  isOpen: boolean;
  selectedFilterNumber?: number;
  setTriggerRef?: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  onClick?: () => void;
};
