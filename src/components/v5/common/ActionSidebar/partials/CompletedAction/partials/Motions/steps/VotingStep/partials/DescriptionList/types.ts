export interface DescriptionListItem {
  key: string;
  value: React.ReactNode;
  label: React.ReactNode;
}

export interface DescriptionListProps {
  items: DescriptionListItem[];
  className?: string;
}
