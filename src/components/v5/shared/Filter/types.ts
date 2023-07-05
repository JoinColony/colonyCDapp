export type FilterButtonProps = {
  isOpen: boolean;
  ref: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  onClick: () => void;
};
