export interface MeatBallItem {
  key: string;
  label: React.ReactNode;
  iconName: string;
  onClick: () => void;
}

export interface MeatBallMenuProps {
  items: MeatBallItem[];
  cardClassName?: string;
  buttonClassName?: string;
}
