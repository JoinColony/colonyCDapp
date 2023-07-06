export type FilterButtonProps = {
  isOpen: boolean;
  selectedFilterNumber?: number;
  ref?: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  onClick: () => void;
};
