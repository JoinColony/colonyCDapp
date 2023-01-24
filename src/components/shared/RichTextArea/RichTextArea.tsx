import React from 'react';
import { useFormContext } from 'react-hook-form';

import {
  CoreInputProps,
  HookFormInputProps,
  InputLabel,
  InputStatus,
} from '~shared/Fields';
import RichTextEditor, { RichTextEditorProps } from '~shared/RichTextEditor';
import { Message } from '~types';

type RichTextAreaProps = Omit<
  CoreInputProps,
  'placeholder' | 'placeholderValues' | 'name' | 'disabled'
> &
  Pick<HookFormInputProps, 'appearance'> &
  RichTextEditorProps;

const displayName = 'RichTextArea';

const RichTextArea = ({
  appearance,
  dataTest,
  elementOnly,
  extra,
  help,
  helpValues,
  label,
  labelValues,
  status,
  statusValues,
  name,
  ...editorProps
}: RichTextAreaProps) => {
  const {
    formState: { errors, touchedFields },
  } = useFormContext();

  const isTouched = !!touchedFields[name];
  const error = errors[name];

  return (
    <div data-test={dataTest}>
      {label && !elementOnly && (
        <InputLabel
          label={label}
          labelValues={labelValues}
          extra={extra}
          help={help}
          helpValues={helpValues}
          appearance={appearance}
        />
      )}
      <RichTextEditor name={name} {...editorProps} />
      <InputStatus
        status={status}
        statusValues={statusValues}
        appearance={appearance}
        touched={isTouched}
        error={error?.message as Message | undefined}
      />
    </div>
  );
};

RichTextArea.displayName = displayName;
export default RichTextArea;
