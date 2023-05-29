import { MessageFormatElement } from 'react-intl';

export interface AccordionProps {
  items: AccordionContent[];
  openIndex: number;
  onOpenIndexChange: (newOpenIndex: number | undefined) => void;
}

export interface AccordionContent {
  id: string;
  title: string;
  content?: AccordionContentDetails[];
}

export interface AccordionContentDetails {
  id: number | string;
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
  title?: string | JSX.Element;
  content?: AccordionContentDetails[];
  isOpen?: boolean;
  onClick?: () => void;
}
export interface ContentTypeProps {
  title?: string | MessageFormatElement[];
  subTitle?: string | MessageFormatElement[];
  details?: string;
}

export interface AccordionContentItemProps {
  accordionItem: AccordionMocksItemProps;
  isOpen?: boolean;
  onClick?: () => void;
}

export interface SpecialInputProps {
  defaultValue?: number | string;
  maxValue: number;
}
