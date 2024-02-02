export type DescriptionFieldProps = {
  isDecriptionFieldExpanded: boolean;
  toggleOffDecriptionSelect: () => void;
  toggleOnDecriptionSelect: () => void;
  fieldName: string;
  maxDescriptionLength?: number;
  disabled?: boolean;
};
