export interface PermissionsBoxItem {
  initiatorAddress: string;
  createdAt: string;
}

export interface PermissionsBoxProps {
  items: PermissionsBoxItem[];
}
