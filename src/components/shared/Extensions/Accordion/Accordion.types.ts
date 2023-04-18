import { AccordionItemProps } from './Partials/AccordtionItem.types';

export interface AccordionProps {
  items: AccordionItemProps[];
  openIndex?: number;
  onOpenIndexChange?: (newOpenIndex: number | undefined) => void;
}

export interface AccordionMocksContentProps {
  content: AccordionMocksContent[];
}

export interface AccordionMocksContent {
  id: number;
  textItem?: JSX.Element;
  inputItem?: JSX.Element;
  accordionItem?: AccordionMocksItemProps[];
}

export interface AccordionMocksItemProps {
  id: number;
  header: JSX.Element;
  content: JSX.Element;
}

export interface AccordionContentItemProps {
  items?: AccordionItemProps[];
  accordionItem: AccordionMocksItemProps;
  isOpen: boolean;
  onClick: () => void;
}

export interface AccordionHeaderProps {
  title: string | JSX.Element;
}

export interface ContentTypeTextProps {
  title: string;
  subTitle: string;
}
