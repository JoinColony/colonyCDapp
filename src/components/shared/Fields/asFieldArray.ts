import { createElement } from 'react';
import { FieldArray, FieldArrayRenderProps } from 'formik';

export type AsFieldArrayEnhancedProps<P> = P & FieldArrayRenderProps;

interface Props {
  name: string;
  value?: string;
  className?: string;
  disabled?: boolean;
}

const asFieldArray = () => (Component: any) =>
  function ({ name, ...props }: Props) {
    return createElement(FieldArray, {
      name,
      render: (formikProps) =>
        createElement(Component, { ...props, ...formikProps }),
    });
  };

export default asFieldArray;
