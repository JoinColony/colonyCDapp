import { ButtonHTMLAttributes } from 'react';
import { FieldErrorsImpl, UseFormRegister } from 'react-hook-form';
import { MessageDescriptor } from 'react-intl';

import { FormRadioButton } from '~common/Extensions/Fields/RadioList/types';
import {
  ComponentType,
  FormPercentageInput,
} from '~common/Extensions/SpecialInput/types';

export interface AccordionProps {
  items: AccordionContent[] | unknown[];
  openIndex: number;
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
}

export interface AccordionContentDetails {
  id: number | string;
  textItem?: JSX.Element;
  inputItem?: JSX.Element;
  inputData: {
    inputType: 'percent' | 'hours';
    maxValue: number;
    minValue: number;
    name: string;
    errors: Partial<
      | FieldErrorsImpl<{
          percent: number;
          hours: number;
        }>
      | undefined
    >;
    register?: UseFormRegister<FormRadioButton | FormPercentageInput>;
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
