import { ExtensionStatusBadgeMode } from '../ExtensionStatusBadge-new/types';

export interface ExtensionItemProps {
  title: string;
  description: string;
  version: string;
  status: ExtensionStatusBadgeMode;
  badgeText: string;
  isInstalled?: boolean;
  icon: string;
  extensionId: string;
}
