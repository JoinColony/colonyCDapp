import { FieldErrorsImpl, UseFormRegister } from 'react-hook-form';
import { MessageFormatElement } from 'react-intl';
import { ComponentType, FormPercentageInput } from '~common/Extensions/SpecialInput/types';
import { FormRadioButton } from '../Fields/RadioList/types';

export interface AccordionProps {
  items: AccordionContent[];
  openIndex: number;
  onOpenIndexChange: (newOpenIndex: number | undefined) => void;
}

export interface ContentTypeProps {
  title?:
    | string
    | {
        defaultMessage: string;
      };
  subTitle?:
    | string
    | {
        defaultMessage: string;
      };
  details?: string;
}

export interface AccordionContent extends ContentTypeProps {
  paramName: string;
  complementaryLabel: ComponentType;
  id?: string;
  description?: {
    defaultMessage: MessageFormatElement[];
  };
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
