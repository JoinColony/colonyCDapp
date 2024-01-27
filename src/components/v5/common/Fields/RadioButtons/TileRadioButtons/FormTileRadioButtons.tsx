import React from 'react';
import { useController } from 'react-hook-form';

import TileRadioButtons from './TileRadioButtons.tsx';
import { FormTileRadioButtonsProps } from './types.ts';

const displayName = 'v5.common.Fields.CardSelect.FormTileRadioButtons';

function FormTileRadioButtons<TValue = string>({
  name,
  ...rest
}: FormTileRadioButtonsProps<TValue>): JSX.Element {
  const {
    field: { onChange, value },
  } = useController({
    name,
  });

  return (
    <TileRadioButtons<TValue> {...rest} value={value} onChange={onChange} />
  );
}

FormTileRadioButtons.displayName = displayName;

export default FormTileRadioButtons;
