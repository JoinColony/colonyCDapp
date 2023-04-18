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
  <P>(Component: any) =>
  ({ name, ...props }: P & Props) => {
    return createElement(FieldArray, {
      name,
      render: (formikProps) => createElement(Component, { ...props, ...formikProps }),
    });
  };

export default asFieldArray;
