import { Dispatch, SetStateAction } from 'react';

export interface AdditionalFormState {
  readonly?: boolean;
}

export interface AdditionalFormOptionsContextValue extends AdditionalFormState {
  setFormState: Dispatch<SetStateAction<AdditionalFormState>>;
}
