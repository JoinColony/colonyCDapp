import { createElement } from 'react';
import { FieldArray, FieldArrayRenderProps } from 'formik';

export type AsFieldArrayEnhancedProps<P> = P & FieldArrayRenderProps;

interface Props {
  name: string;
  value?: string;
  className?: string;
  disabled?: boolean;
}

const asFieldArray =
  () =>
  (Component: any) =>
  ({ name, ...props }: Props) =>
    createElement(FieldArray, {
      name,
      render: (formikProps) =>
        createElement(Component, { ...props, ...formikProps }),
    });

export default asFieldArray;
