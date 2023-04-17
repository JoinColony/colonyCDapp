export interface AccordionItemProps {
  id: number;
  title: string;
  content?: JSX.Element | string;
  isOpen?: boolean;
  onClick?: () => void;
}
