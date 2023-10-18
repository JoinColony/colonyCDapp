import { AccordionItemProps } from './partials/AccordionItem/types';

export interface AccordionItem
  extends Omit<AccordionItemProps, 'className' | 'isOpen' | 'onToggle'> {
  key: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  openedItemIndexes?: number[];
  className?: string;
  itemClassName?: string;
}
