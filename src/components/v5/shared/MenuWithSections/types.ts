export interface MenuWithSectionsItem {
  key: string;
  className?: string;
  content: React.ReactNode;
}

export interface MenuWithSectionsProps {
  sections: MenuWithSectionsItem[];
  footer?: React.ReactNode;
  footerClassName?: string;
}
