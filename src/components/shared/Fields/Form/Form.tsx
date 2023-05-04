import { FormikConfig, Formik, Form as FormikForm } from 'formik';
import React from 'react';

const displayName = 'Form';

const Form = <V extends Record<string, any>>({ children, ...props }: FormikConfig<V>) => (
  <Formik<V> {...props}>
    {(injectedProps) => <FormikForm>{typeof children == 'function' ? children(injectedProps) : children}</FormikForm>}
  </Formik>
);

Form.displayName = displayName;

export default Form;
