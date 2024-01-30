import { type FieldValues, type UseFieldArrayReturn } from 'react-hook-form';

export interface VerifiedMembersSelectProps {
  name: string;
  fieldArrayMethods: UseFieldArrayReturn<FieldValues, string, 'id'>;
}
