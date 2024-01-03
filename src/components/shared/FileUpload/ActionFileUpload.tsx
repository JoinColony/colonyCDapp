import React from 'react';

import { useAsyncFunction } from '~hooks';
import { ActionTransformFnType } from '~utils/actions';

import FileUpload from './FileUpload';

interface Props {
  submit: string;
  success: string;
  error: string;
  transform?: ActionTransformFnType;
  accept?: string[];
  maxFileSize?: number;
  name: string;
  label?: any;
  status?: any;
}

const ActionFileUpload = ({
  submit,
  success,
  error,
  transform,
  ...props
}: Props) => {
  const asyncFunction = useAsyncFunction({ submit, error, success, transform });
  return <FileUpload upload={asyncFunction} {...props} />;
};

export default ActionFileUpload;
