export type FilterProps = {
  isOpen: boolean;
  setOpen: () => void;
};

export type FilterOptionsProps = {
  options: FilterOption[];
};

export type FilterOption = {
  id: number;
  title: string;
  option: string;
  iconName: string;
  content: any;
};

export type DesktopFilterProps = {
  isOpened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
};
