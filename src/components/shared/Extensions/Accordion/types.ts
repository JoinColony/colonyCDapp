import { type ButtonHTMLAttributes, type SyntheticEvent } from 'react';
import { type FieldErrorsImpl } from 'react-hook-form';
import { type MessageDescriptor } from 'react-intl';

import { type ComponentType } from '~common/Extensions/SpecialInput/types.ts';

export interface AccordionProps {
  items: AccordionContent[] | unknown[];
  openIndex: number;
  onInputChange?: (e: SyntheticEvent<HTMLInputElement>) => void;
  onOpenIndexChange: (newOpenIndex: number | undefined) => void;
  errors?: Partial<
    FieldErrorsImpl<{
      [x: string]: any;
    }>
  >;
}

export interface ContentTypeProps {
  title?: string | MessageDescriptor;
  subTitle?: string | MessageDescriptor;
}

export interface AccordionContent extends ContentTypeProps {
  paramName: string;
  complementaryLabel: ComponentType;
  id?: string;
  description?: MessageDescriptor | string;
  defaultValue: number;
  maxValue: number;
  content?: AccordionContentDetails[];
  accordionItemDescription?: string | MessageDescriptor;
}

export interface AccordionContentDetails {
  id: number | string;
  textItem?: JSX.Element;
  inputItem?: JSX.Element;
  inputData: {
    inputType: 'percent' | 'hours';
    max: number;
    min: number;
    name: string;
    step?: number;
  };
  accordionItem?: AccordionMocksItemProps[];
  maxValue: any;
}

export interface AccordionMocksItemProps {
  id: string;
  header: string;
  content: string | MessageDescriptor;
}

export interface AccordionHeaderProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title'> {
  title?: MessageDescriptor | string;
  isOpen?: boolean;
}

export interface AccordionItemProps {
  title?: MessageDescriptor | string;
  content?: AccordionContentDetails[];
  isOpen?: boolean;
  onInputChange: (e: SyntheticEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  errors?: Partial<
    FieldErrorsImpl<{
      [x: string]: any;
    }>
  >;
}

export interface AccordionNestedItemProps {
  accordionItem: AccordionMocksItemProps;
}
