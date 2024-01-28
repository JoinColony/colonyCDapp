import { type ExtensionItemProps } from '~common/Extensions/ExtensionItem/types.ts';

export interface ExtensionItem extends ExtensionItemProps {
  id: string;
}

export enum GovernanceOptions {
  SPEED_OVER_SECURITY = 'speed-over-security',
  SECURITY_OVER_SPEED = 'security-over-speed',
  TESTING_GOVERNANCE = 'testing-governance',
  CUSTOM = 'custom-advanced',
}
