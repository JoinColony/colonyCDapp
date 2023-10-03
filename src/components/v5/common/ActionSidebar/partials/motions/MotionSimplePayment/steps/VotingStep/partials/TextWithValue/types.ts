export interface TextWithValueItem {
  key: string;
  rightColumn: React.ReactNode;
  leftColumn: React.ReactNode;
}

export interface TextWithValueProps {
  items: TextWithValueItem[];
}
