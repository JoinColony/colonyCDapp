import { FieldErrorsImpl, UseFormRegister } from 'react-hook-form';
import { MessageDescriptor } from 'react-intl';
import {
  ComponentType,
  FormPercentageInput,
} from '~common/Extensions/SpecialInput/types';
import { FormRadioButton } from '../Fields/RadioList/types';

export interface AccordionProps {
  items: AccordionContent[];
  openIndex: number;
  onOpenIndexChange: (newOpenIndex: number | undefined) => void;
  errors?: Partial<
    FieldErrorsImpl<{
      [x: string]: any;
    }>
  >;
}

export interface ContentTypeProps {
  title?: string | React.ReactNode;
  subTitle?: string | React.ReactNode;
  details?: string;
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
  header: JSX.Element;
  content: JSX.Element;
}
export interface AccordionItemProps {
  title?: string | React.ReactNode;
  content?: AccordionContentDetails[];
  isOpen?: boolean;
  onClick?: () => void;
  errors?: Partial<
    FieldErrorsImpl<{
      [x: string]: any;
    }>
  >;
}

export interface AccordionContentItemProps {
  accordionItem: AccordionMocksItemProps;
  isOpen?: boolean;
  onClick?: () => void;
}

export interface SpecialInputProps {
  defaultValue?: number | string;
  maxValue?: number;
  minValue?: number;
  name?: string;
  register?: UseFormRegister<FormRadioButton | FormPercentageInput>;
  errors?: Partial<
    | FieldErrorsImpl<{
        percent: number;
        hours: number;
      }>
    | undefined
  >;
}
