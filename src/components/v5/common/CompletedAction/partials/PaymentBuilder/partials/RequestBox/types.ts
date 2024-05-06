import { type RequestBoxItemProps } from './partials/types.ts';

export interface RequestBoxItem extends RequestBoxItemProps {
  key: string;
}

export interface RequestBoxProps {
  title: string;
  items: RequestBoxItem[];
}
