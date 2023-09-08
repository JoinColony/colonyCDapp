export interface CardWithSectionItem {
  key: string;
  className?: string;
  content: React.ReactNode;
}

export interface CardWithSectionsProps {
  sections: CardWithSectionItem[];
}
