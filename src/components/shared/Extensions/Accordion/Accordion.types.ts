export interface AccordionProps {
  items: AccordionMocksContent[];
  openIndex?: number;
  onOpenIndexChange?: (newOpenIndex: number | undefined) => void;
}

export interface AccordionMocksContent {
  id: string;
  title: string;
  content: AccordionMocksContentDetails[];
}

export interface AccordionMocksContentDetails {
  id: number;
  textItem?: JSX.Element;
  inputItem?: JSX.Element;
  accordionItem?: AccordionMocksItemProps[];
}

export interface AccordionMocksItemProps {
  id: string;
  header: JSX.Element;
  content: JSX.Element;
}
export interface AccordionItemProps {
  title?: string;
  content?: AccordionMocksContentDetails[];
  isOpen?: boolean;
  onClick?: () => void;
}
export interface ContentTypeProps {
  title?: string;
  subTitle?: string;
  details?: string;
}
