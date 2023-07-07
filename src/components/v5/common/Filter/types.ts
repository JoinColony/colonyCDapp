export type FilterOptionsProps = {
  options: FilterOption[];
};

export type FilterOption = {
  id: number;
  title: string;
  option: string;
  iconName: string;
  content: unknown[];
};

export type FilterPopoverProps = {
  isOpened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
};
