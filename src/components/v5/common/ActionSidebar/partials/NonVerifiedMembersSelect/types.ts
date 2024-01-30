import { type FieldValues, type UseFieldArrayReturn } from 'react-hook-form';

export interface NonVerifiedMembersSelectProps {
  name: string;
  fieldArrayMethods: UseFieldArrayReturn<FieldValues, string, 'id'>;
}
