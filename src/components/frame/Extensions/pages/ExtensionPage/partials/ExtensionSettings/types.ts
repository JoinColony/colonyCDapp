import { type Extension } from '@colony/colony-js';

export interface ExtensionSettingsBaseProps {
  extensionId: Extension;
  params?: Record<string, string> | null;
}
