import { ChangeEvent } from 'react';

export interface SearchInputProps {
  onInput: (e: ChangeEvent<HTMLInputElement>) => void;
}
