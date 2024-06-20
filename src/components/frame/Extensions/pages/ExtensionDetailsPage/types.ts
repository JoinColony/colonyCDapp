import { type RefetchExtensionDataFn } from '~hooks/useExtensionData.ts';
import { type AnyExtensionData } from '~types/extensions.ts';

export enum ExtensionDetailsPageTabId {
  Overview = 0,
  Settings = 1,
}

export interface ExtensionDetailsPageContentProps {
  extensionData: AnyExtensionData;
  refetchExtensionData: RefetchExtensionDataFn;
}
